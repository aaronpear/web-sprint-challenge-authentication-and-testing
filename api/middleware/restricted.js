const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/index.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next({ status: 401, message: 'token required' });
  } else {
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) {
        next({ status: 401, message: 'token invalid' });
      } else {
        next();
      }
    })
  }
};
