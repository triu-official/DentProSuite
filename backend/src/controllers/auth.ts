import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { User } from '../../../shared/types/index.js';
import { generateToken } from '../auth/auth.js';

const dbUsers = getDatabaseAdapter<User>('users');

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users = await dbUsers.getAll();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    // Return safe user info
    const { passwordHash, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const me = async (req: Request, res: Response) => {
  // requiresAuth middleware sets req.user
  const userReq = (req as any).user;
  const user = await dbUsers.getById(userReq.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
};
