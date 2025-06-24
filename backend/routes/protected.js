const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Access denied. No roles found.' });
    }

    const hasRole = roles.some(role => req.user.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to dashboard!',
    user: {
      id: req.user.id,
      email: req.user.email,
      roles: req.user.roles
    }
  });
});

router.get('/admin', authenticateToken, requireRole(['admin']), (req, res) => {
  res.json({
    message: 'Admin area accessed successfully!',
    data: {
      secretData: 'This is admin-only information',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;