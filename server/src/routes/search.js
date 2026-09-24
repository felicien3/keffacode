import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();

// GET /api/search?q=loop&type=all|tutorials|problems
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const type = req.query.type || 'all';
    if (!q) return res.json({ tutorials: [], problems: [] });
    const like = `%${q}%`;

    const tutorials = type === 'problems' ? [] : (await query(
      `SELECT t.title, t.slug, t.summary, c.name AS category
       FROM tutorials t LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.published AND (t.title ILIKE $1 OR t.summary ILIKE $1 OR t.body ILIKE $1)
       ORDER BY t.title LIMIT 20`, [like])).rows;

    const problems = type === 'tutorials' ? [] : (await query(
      `SELECT p.title, p.slug, p.difficulty, c.name AS category
       FROM problems p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.title ILIKE $1 OR p.statement ILIKE $1
       ORDER BY p.title LIMIT 20`, [like])).rows;

    res.json({ tutorials, problems });
  } catch (err) { next(err); }
});

export default router;
