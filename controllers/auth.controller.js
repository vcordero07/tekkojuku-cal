const jwt = require('jsonwebtoken');
const {
  Instructor
} = require('../models/instructor.model');
let tkn;

const createAuthToken = user => {
  return jwt.sign({
    user
  }, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: 'HS256'
  }, (err, token) => {
    console.log('Auth.controller token:', token);
    // console.log('user:', user.setToken());
    user.setToken(token);
    // console.log('user.setToken():', user.setToken());
    user.token = token;
    tkn = token;
    console.log('user:', user);
  });
};
exports.login = (req, res) => {
  console.log('req.user.getToken():', req.user.getToken());
  // The user provides a username and password to login
  // console.log(req.body);
  // console.log(req.user.apiRepr(), req.user.setToken());
  const authToken = createAuthToken(req.user);
  res.json({
    // authToken
    "login": "In process"
  });
};
exports.getAuthToken = (req, res) => {
  console.log('Instructor:', Instructor);
  res.status(200).send(tkn);
};
