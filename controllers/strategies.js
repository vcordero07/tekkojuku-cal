const passport = require('passport');
const {
  BasicStrategy
} = require('passport-http');
const {
  // Assigns the Strategy export to the name JwtStrategy using object
  // destructuring
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
  Strategy: JwtStrategy,
  ExtractJwt
} = require('passport-jwt');

const {
  Instructor
} = require('../models/instructor.model');

const JWT_SECRET = process.env.JWT_SECRET;


const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  console.log('strategies.js:22 - username', username);
  Instructor.findOne({
      username: username
    })
    .then(_user => {
      user = _user;
      // console.log('strategies.js:28 - _user:', _user);
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }

      return user.validatePassword(password);
    })
    .then(isValid => {
      // console.log('strategies.js:41 - isValid:', isValid);
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      // console.log('strategies.js:51 - err:', err);
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const jwtStrategy = new JwtStrategy({
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // jwtFromRequest: Instructor.getToken(),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    console.log('strategies.js:68 - payload:', payload);
    done(null, payload.user);
  }
);
// const jwtStrategy = () => {
//   console.log('strategies.js:73', ExtractJwt.fromAuthHeaderWithScheme('Bearer'));
// }

module.exports = {
  basicStrategy,
  jwtStrategy
};
