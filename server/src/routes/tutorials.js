import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/tutorials?category=javascript&q=loop&limit=20
router.get('/', async (req, res, next) => {
  try {
    const { category, q, limit = 50 } = req.query;
    const params = [];
    const where = ['t.published = true'];
    if (category) { params.push(category); where.push(`c.slug = $${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`(t.title ILIKE $${params.length} OR t.summary ILIKE $${params.length})`); }
    params.push(Math.min(Number(limit) || 50, 100));

    const { rows } = await query(
      `SELECT t.id, t.title, t.slug, t.summary, t.read_minutes, t.created_at,
              c.name AS category, c.slug AS category_slug
       FROM tutorials t LEFT JOIN categories c ON c.id = t.category_id
       WHERE ${where.join(' AND ')}
       ORDER BY t.created_at DESC
       LIMIT $${params.length}`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { rows: [tutorial] } = await query(
      `SELECT t.*, c.name AS category, c.slug AS category_slug, u.username AS author
       FROM tutorials t
       LEFT JOIN categories c ON c.id = t.category_id
       LEFT JOIN users u ON u.id = t.author_id
       WHERE t.slug = $1`,
      [req.params.slug]
    );
    if (!tutorial) return res.status(404).json({ error: 'That tutorial does not exist.' });
    res.json(tutorial);
  } catch (err) { next(err); }
});

// Mark as read — used by the progress bar on the profile page.
router.post('/:slug/complete', requireAuth, async (req, res, next) => {
  try {
    const { rows: [tutorial] } = await query('SELECT id FROM tutorials WHERE slug = $1', [req.params.slug]);
    if (!tutorial) return res.status(404).json({ error: 'That tutorial does not exist.' });
    await query(
      `INSERT INTO tutorial_progress (user_id, tutorial_id) VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, tutorial.id]
    );
    res.status(201).json({ completed: true });
  } catch (err) { next(err); }
});

export default router;
