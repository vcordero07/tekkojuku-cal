require('dotenv').config()

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const { DATABASE_URL } = require('./config');
const { TEST_DATABASE_URL } = require('./config');

const app = express();
const methodOverride = require('method-override');
const authRoute = require('./routes/auth.route');
const instructorRoute = require('./routes/instructor.route');
const calendarRoute = require('./routes/calendar.route');

const { basicStrategy, jwtStrategy } = require('./controllers/strategies');

const mongoUrl = (process.env.MONGO_USE_TEST) ? (process.env.MONGO_TESTING_URL) :
  (process.env.MONGO_USE_LOCAL === 'true') ?
  (process.env.MONGO_LOCAL_URL) :

  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_WEB_URL}${process.env.MONGO_DB}${process.env.MONGO_AUTH}`;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(function(req, res, next) {

  // console.log('server.js:32 - setting req.header', req.headers.authorization);
  if (process.env.JWT_TOKEN !== "") {
    // req.headers.authorization = process.env.JWT_TOKEN;
    req.headers.authorization = 'Bearer ' + process.env.JWT_TOKEN;
    // console.log('req.headers:', process.env);
    // req.query = process.env.JWT_TOKE;
    // req.header('Authorization', 'Bearer ' + process.env.JWT_TOKEN);
  }
  // console.log('server.js:37 - xsetting req.header', req.headers.authorization);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (process.env.JWT_TOKEN !== "") {
    console.log('server.js:42 - test log:', process.env.JWT_TOKEN);
    res.header('Authorization', 'Bearer ' + process.env.JWT_TOKEN);
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.static(path.resolve(__dirname, './assets')));
console.log("server.js:53 - path", path.resolve(__dirname, './assets'));

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('./index');
});

app.use('/calendar', calendarRoute);


app.get('/login', (req, res) => {
  res.render('./login');
});

app.get('/logout', (req, res) => {
  process.env.JWT_TOKEN = ""
  res.render('./logout');
});

app.get('/signup', (req, res) => {
  res.render('./signup');
});

app.use('/auth', authRoute);

app.use('/instructors', instructorRoute)

app.use('*', (req, res) => {
  return res.status(404).json({
    message: 'Not Found'
  });
});

// app.listen(process.env.PORT || 3000, function() {
//   console.log('server.js:85 - The server is running on port 3000!');
// });

let server;

function runServer(databaseUrl = DATABASE_URL, port = process.env.PORT || 3000) {
  return new Promise((resolve, reject) => {
    console.log('server.js:92 - DATABASE_URL:', DATABASE_URL);
    console.log('server.js:93 - mongoUrl', mongoUrl);
    mongoose.connect(mongoUrl, { useMongoClient: true }, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
          console.log(`server.js:101 - Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    }).catch((err) => {
      console.log("server.js:109", err);
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('server.js:117 - Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error("server.js:129", err));
};

module.exports = { runServer, app, closeServer };
