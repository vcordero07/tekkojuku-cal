const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  Instructor
} = require('../models/instructor.model');


const createAuthToken = user => {
  return jwt.sign({
    user
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
exports.login = (req, res) => {
  // The user provides a username and password to login
  passport.authenticate('basic', {
      session: false
    }),
    (req, res) => {
      const authToken = createAuthToken(req.user.apiRepr());
      res.json({
        authToken
      });
    }
};
