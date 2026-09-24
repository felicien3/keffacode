import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';
import { slugify } from '../lib/slug.js';

const router = Router();
router.use(requireAdmin);

router.get('/stats', async (_req, res, next) => {
  try {
    const { rows: [stats] } = await query(
      `SELECT (SELECT count(*)::int FROM users) AS users,
              (SELECT count(*)::int FROM tutorials) AS tutorials,
              (SELECT count(*)::int FROM problems) AS problems,
              (SELECT count(*)::int FROM submissions) AS submissions,
              (SELECT count(*)::int FROM submissions WHERE status = 'passed') AS accepted`
    );
    const { rows: byDifficulty } = await query(
      'SELECT difficulty, count(*)::int AS n FROM problems GROUP BY difficulty'
    );
    res.json({ ...stats, byDifficulty });
  } catch (err) { next(err); }
});

router.get('/users', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT u.id, u.username, u.email, u.role, u.created_at,
              (SELECT count(*)::int FROM submissions s WHERE s.user_id = u.id) AS submissions
       FROM users u ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Role must be user or admin.' });
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ error: 'You cannot change your own role.' });
    await query('UPDATE users SET role = $1 WHERE id = $2', [role, req.params.id]);
    res.json({ updated: true });
  } catch (err) { next(err); }
});

// ---- tutorials -------------------------------------------------------------

router.post('/tutorials', async (req, res, next) => {
  try {
    const { title, summary = '', body, category_id, read_minutes = 5, published = true } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'A tutorial needs a title and a body.' });
    const { rows: [row] } = await query(
      `INSERT INTO tutorials (title, slug, summary, body, category_id, read_minutes, published, author_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, slugify(title), summary, body, category_id || null, read_minutes, published, req.user.id]
    );
    res.status(201).json(row);
  } catch (err) { next(err); }
});

router.put('/tutorials/:id', async (req, res, next) => {
  try {
    const { title, summary, body, category_id, read_minutes, published } = req.body;
    const { rows: [row] } = await query(
      `UPDATE tutorials SET title = COALESCE($1, title), summary = COALESCE($2, summary),
              body = COALESCE($3, body), category_id = $4,
              read_minutes = COALESCE($5, read_minutes), published = COALESCE($6, published)
       WHERE id = $7 RETURNING *`,
      [title, summary, body, category_id || null, read_minutes, published, req.params.id]
    );
    if (!row) return res.status(404).json({ error: 'That tutorial does not exist.' });
    res.json(row);
  } catch (err) { next(err); }
});

router.delete('/tutorials/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM tutorials WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'That tutorial does not exist.' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

// ---- problems --------------------------------------------------------------

router.post('/problems', async (req, res, next) => {
  const client = await (await import('../lib/db.js')).pool.connect();
  try {
    const { title, difficulty, statement, fn_name, starter_code = '', category_id, tests = [] } = req.body;
    if (!title || !statement || !fn_name) {
      return res.status(400).json({ error: 'A problem needs a title, a statement and a function name.' });
    }
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Difficulty must be easy, medium or hard.' });
    }
    if (!tests.length) return res.status(400).json({ error: 'Add at least one test case.' });

    await client.query('BEGIN');
    const { rows: [problem] } = await client.query(
      `INSERT INTO problems (title, slug, difficulty, statement, fn_name, starter_code, category_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, slugify(title), difficulty, statement, fn_name, starter_code, category_id || null]
    );
    let position = 0;
    for (const t of tests) {
      await client.query(
        'INSERT INTO test_cases (problem_id, args, expected, is_sample, position) VALUES ($1,$2,$3,$4,$5)',
        [problem.id, JSON.stringify(t.args), JSON.stringify(t.expected), Boolean(t.is_sample), position++]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(problem);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

router.delete('/problems/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM problems WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'That problem does not exist.' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

export default router;
