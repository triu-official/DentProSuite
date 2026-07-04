import jwt from 'jsonwebtoken';
import { getEnv } from '../utils/env.js';

export function generateToken(payload: object, expiresIn = '1d') {
  const env = getEnv();
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  const env = getEnv();
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
