import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export default async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or malformed token' });
    }
    const token = header.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select('email');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
}


