import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../lib/db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();
const publicUser = (u) => ({ id: u.id, username: u.username, email: u.email, role: u.role, bio: u.bio });

router.post('/register', async (req, res, next) => {
  try {
    const { username = '', email = '', password = '' } = req.body;
    if (username.trim().length < 3) return res.status(400).json({ error: 'Username needs at least 3 characters.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password needs at least 8 characters.' });

    const taken = await query('SELECT 1 FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (taken.rowCount) return res.status(400).json({ error: 'That username or email is already registered.' });

    const hash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3)
       RETURNING id, username, email, role, bio`,
      [username.trim(), email.toLowerCase(), hash]
    );
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;
    const { rows: [user] } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'That email and password do not match.' });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows: [user] } = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
});

export default router;
