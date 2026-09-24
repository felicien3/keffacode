import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { runTests } from '../lib/runner.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { difficulty, category, q } = req.query;
    const params = [];
    const where = ['1 = 1'];
    if (difficulty) { params.push(difficulty); where.push(`p.difficulty = $${params.length}`); }
    if (category) { params.push(category); where.push(`c.slug = $${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`p.title ILIKE $${params.length}`); }

    const { rows } = await query(
      `SELECT p.id, p.title, p.slug, p.difficulty, c.name AS category, c.slug AS category_slug,
              (SELECT count(*) FROM test_cases tc WHERE tc.problem_id = p.id) AS test_count
       FROM problems p LEFT JOIN categories c ON c.id = p.category_id
       WHERE ${where.join(' AND ')}
       ORDER BY CASE p.difficulty WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, p.title`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { rows: [problem] } = await query(
      `SELECT p.*, c.name AS category, c.slug AS category_slug
       FROM problems p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.slug = $1`,
      [req.params.slug]
    );
    if (!problem) return res.status(404).json({ error: 'That problem does not exist.' });

    // Only sample tests are visible before submitting.
    const { rows: samples } = await query(
      'SELECT id, args, expected FROM test_cases WHERE problem_id = $1 AND is_sample ORDER BY position',
      [problem.id]
    );
    const { rows: [{ count }] } = await query(
      'SELECT count(*)::int FROM test_cases WHERE problem_id = $1', [problem.id]
    );
    res.json({ ...problem, samples, test_count: count });
  } catch (err) { next(err); }
});

// Run the code without recording a submission.
router.post('/:slug/run', requireAuth, async (req, res, next) => {
  try {
    const result = await execute(req.params.slug, req.body.code, { samplesOnly: true });
    if (result.error) return res.status(result.status).json({ error: result.error });
    res.json(result);
  } catch (err) { next(err); }
});

// Run every test and store the attempt.
router.post('/:slug/submit', requireAuth, async (req, res, next) => {
  try {
    const result = await execute(req.params.slug, req.body.code, { samplesOnly: false });
    if (result.error) return res.status(result.status).json({ error: result.error });

    const passed = result.results.filter((r) => r.passed).length;
    await query(
      `INSERT INTO submissions (user_id, problem_id, code, status, passed_count, total_count, runtime_ms, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [req.user.id, result.problemId, req.body.code, result.status, passed, result.results.length, result.runtimeMs, result.message]
    );
    res.json(result);
  } catch (err) { next(err); }
});

async function execute(slug, code, { samplesOnly }) {
  if (typeof code !== 'string' || !code.trim()) {
    return { error: 'Write some code before running it.', status: 400 };
  }
  if (code.length > 20000) return { error: 'That solution is too long to run.', status: 400 };

  const { rows: [problem] } = await query('SELECT id, fn_name FROM problems WHERE slug = $1', [slug]);
  if (!problem) return { error: 'That problem does not exist.', status: 404 };

  const { rows: tests } = await query(
    `SELECT id, args, expected, is_sample FROM test_cases
     WHERE problem_id = $1 ${samplesOnly ? 'AND is_sample' : ''} ORDER BY position`,
    [problem.id]
  );

  const outcome = await runTests({ code, fnName: problem.fn_name, tests });
  // Hide the expected values of hidden tests in the response.
  outcome.results = outcome.results.map((r) => (r.is_sample ? r : { ...r, actual: undefined }));
  return { ...outcome, problemId: problem.id };
}

export default router;
