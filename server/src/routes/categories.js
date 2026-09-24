import { Router } from 'express';
import { query } from '../lib/db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT c.id, c.name, c.slug, c.blurb,
              (SELECT count(*)::int FROM tutorials t WHERE t.category_id = c.id AND t.published) AS tutorial_count,
              (SELECT count(*)::int FROM problems p WHERE p.category_id = c.id) AS problem_count
       FROM categories c ORDER BY c.name`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
