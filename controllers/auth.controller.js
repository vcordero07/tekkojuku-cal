const jwt = require('jsonwebtoken');
const {
  Instructor
} = require('../models/instructor.model');


const createAuthToken = user => {
  return jwt.sign({
    user
  }, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: 'HS256'
  }, (err, token) => {
    console.log('token:', token);
    user.token = token;
    console.log('user:', user);
  });
};
exports.login = (req, res) => {
  // The user provides a username and password to login
  console.log(req.body);
  console.log(req.user);
  const authToken = createAuthToken(req.user.apiRepr());
  res.json({
    // authToken
    "login": "In process"
  });
};
