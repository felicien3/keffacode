import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [solved, attempts, read, totals, recent] = await Promise.all([
      query(`SELECT DISTINCT p.title, p.slug, p.difficulty
             FROM submissions s JOIN problems p ON p.id = s.problem_id
             WHERE s.user_id = $1 AND s.status = 'passed'
             ORDER BY p.title`, [req.user.id]),
      query('SELECT count(*)::int AS n FROM submissions WHERE user_id = $1', [req.user.id]),
      query(`SELECT t.title, t.slug, tp.completed_at
             FROM tutorial_progress tp JOIN tutorials t ON t.id = tp.tutorial_id
             WHERE tp.user_id = $1 ORDER BY tp.completed_at DESC`, [req.user.id]),
      query(`SELECT (SELECT count(*)::int FROM problems) AS problems,
                    (SELECT count(*)::int FROM tutorials WHERE published) AS tutorials`),
      query(`SELECT s.status, s.passed_count, s.total_count, s.created_at, p.title, p.slug
             FROM submissions s JOIN problems p ON p.id = s.problem_id
             WHERE s.user_id = $1 ORDER BY s.created_at DESC LIMIT 10`, [req.user.id]),
    ]);

    res.json({
      solved: solved.rows,
      tutorialsRead: read.rows,
      recentSubmissions: recent.rows,
      stats: {
        submissions: attempts.rows[0].n,
        solvedCount: solved.rowCount,
        problemTotal: totals.rows[0].problems,
        tutorialsReadCount: read.rowCount,
        tutorialTotal: totals.rows[0].tutorials,
      },
    });
  } catch (err) { next(err); }
});

export default router;
