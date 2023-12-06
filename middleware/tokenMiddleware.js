// middleware/tokenMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const accessToken = req.header('Authorization');

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid access token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { verifyToken };
