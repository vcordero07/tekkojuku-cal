const jwt = require('jsonwebtoken');
const { Instructor } = require('../models/instructor.model');
const passport = require('passport');
const cookie = require('cookie');
let tkn;
let instructorID;

const createAuthToken = user => {
  return jwt.sign({ user },
    process.env.JWT_SECRET, {
      subject: user.username,
      expiresIn: process.env.JWT_EXPIRY,
      algorithm: 'HS256'
    }, (err, token) => {
      console.log('auth.controller.js:16 - Auth.controller token:', token);
      // console.log('auth.controller.js:17 - user:', user.setToken());
      user.setToken(token);
      process.env.JWT_TOKEN = token;
      // console.log('auth.controller.js:20 - user.setToken():', user.setToken());
      user.token = token;
      tkn = token;
      instructorID = user._id;
      console.log('auth.controller.js:23 -user:', user);
    });
};

exports.login = (req, res) => {
  console.log('auth.controller.js:28 -req.user.getToken():', req.user.getToken());
  // The user provides a username and password to login
  // console.log("auth.controller.js:30", req.body);
  // console.log("auth.controller.js:31", req.user.apiRepr(), req.user.setToken());
  const authToken = createAuthToken(req.user);
  return res.json({ "id": req.user._id }); // "msg": "Your log in request is in progress!"
};
// exports.login = (req, res) => {
//   console.log('req, res:', req, res);
//   passport.authenticate('basic', { session: false }, function(err, user, info) {
//     console.log('err:', err);
//     console.log('user:', user);
//     console.log('info:', info);
//     if (err) {
//       return res.json({ "msg": 'err' + err });
//     }
//     if (!user) {
//       return res.json({ "msg": 'User does not exist' });
//     }
//     const authToken = createAuthToken(user.apiRepr());
//     return res.json({ authToken });
//
//   })(req, res);
// };
// console.log('auth.controller.js:28 -req.user.getToken():', req.user.getToken());
// // The user provides a username and password to login
// // console.log("auth.controller.js:30", req.body);
// // console.log("auth.controller.js:31", req.user.apiRepr(), req.user.setToken());
// const authToken = createAuthToken(req.user);
// return res.json({ authToken }); // "msg": "Your log in request is in progress!"


exports.getAuthToken = (req, res) => {
  console.log('auth.controller.js:39 -Instructor:', Instructor);
  res.status(200).send({
    tkn,
    instructorID
  });
};
