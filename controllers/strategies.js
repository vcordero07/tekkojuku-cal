const passport = require('passport');
const { BasicStrategy } = require('passport-http');

// Assigns the Strategy export to the name JwtStrategy using object
// destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names

// const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');

const { Instructor } = require('../models/instructor.model');
const JWT_SECRET = process.env.JWT_SECRET;

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('Bearer'), ExtractJwt.fromUrlQueryParameter('auth_token')]),
  secretOrKey: JWT_SECRET,
  algorithms: ['HS256']
}

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  //console.log('strategies.js:22 - username', username);
  Instructor.findOne({ username: username })
    .then(_user => {
      user = _user;
      //console.log('strategies.js:29 - _user:', _user);
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      //console.log("strategies.js:38 - user.validatePassword", user.validatePassword(password));
      return user.validatePassword(password);
    })
    .then(isValid => {
      //console.log('strategies.js:42 - isValid:', isValid);
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      //console.log('strategies.js:52 - err:', err);
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const jwtStrategy = new JwtStrategy(opts, (payload, done) => {
  //console.log('strategies.js:68 - payload:', payload);
  Instructor.findById(payload.user._id, (err, user) => {
    //console.log('strategies.js:80 - err:', err);
    //console.log('strategies.js:81 - user:', user);
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
  })
  // done(null, payload.user);
});

module.exports = { basicStrategy, jwtStrategy };
