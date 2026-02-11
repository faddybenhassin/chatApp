import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/keys.js';
import User from '../models/user.model.js';





export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'No token provided' })

  const token = authHeader.split(' ')[1]

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) return res.status(403).json({ message: err })
    req.user = await User.findById(decoded.id); 
    next()
  });
}