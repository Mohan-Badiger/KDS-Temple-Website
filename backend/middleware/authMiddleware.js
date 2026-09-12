import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// High-speed in-memory user cache (TTL: 60 seconds)
const userCache = new Map();
const CACHE_TTL = 60 * 1000;

export function clearUserCache(userId) {
  if (userId) {
    userCache.delete(userId.toString());
  }
}

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing or malformed token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = (decoded.id || decoded._id)?.toString();

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    const now = Date.now();
    const cached = userCache.get(userId);

    if (cached && now < cached.expiresAt) {
      req.user = cached.user;
      return next();
    }

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      userCache.delete(userId);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Standardize .id and ._id for all controllers
    user.id = user._id.toString();

    // Cache user for 60s
    userCache.set(userId, { user, expiresAt: now + CACHE_TTL });
    req.user = user;
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ success: false, message: 'Unauthorized, token failed' });
  }
}


