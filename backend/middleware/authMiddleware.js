const jwt = require('jwt-simple');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET, true, 'HS256');
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    return res.status(401).send('Invalid Token');
  }
};

module.exports = authMiddleware;
