const Users = require('../users/users-model.js');
  

const validateBody = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({ status: 400, message: 'username and password required' });
    } else {
        next();
    }
}

const checkUsernameExists = async (req, res, next) => {
    const { username } = req.body;
    try {
      const existingUser = await Users.findBy({ username });
      if (existingUser.length === 0) {
        next();
      } else {
        next({ status: 403, message: 'username taken' });
      }  
    } catch (err) {
      next(err);
    }
}

const checkUsernameDoesNotExist = async (req, res, next) => {
    const { username } = req.body;
    try {
      const existingUser = await Users.findBy({ username });
      if (existingUser.length === 0) {
        next({ status: 401, message: 'invalid credentials' });
      } else {
        req.existingUser = existingUser[0];
        next();
      }  
    } catch (err) {
      next(err);
    }
}
  
module.exports = { validateBody, checkUsernameExists, checkUsernameDoesNotExist };