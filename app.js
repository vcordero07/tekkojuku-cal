require('dotenv').config()

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const {
  DATABASE_URL
} = require('./config');

const {
  TEST_DATABASE_URL
} = require('./config');

const app = express();
const methodOverride = require('method-override');
const authRoute = require('./routes/auth.route');
const instructorRoute = require('./routes/instructor.route');

const {
  basicStrategy,
  jwtStrategy
} = require('./controllers/strategies');

const mongoUrl = (process.env.MONGO_USE_LOCAL === 'true') ?
  (process.env.MONGO_LOCAL_URL) :
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_WEB_URL}${process.env.MONGO_DB}${process.env.MONGO_AUTH}`;
// console.log("app.js:31", mongoUrl);
// mongoose.connect(mongoUrl, {
//   useMongoClient: true
// }, (err) => {
//   if (err) {
//     console.error("app.js:36 - Error connecting to mongo");
//     throw err
//   }
//   console.log('app.js:39 - Mongo is running at');
// }).catch(err => {
//   console.log("app.js:41", err);
// });

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.static(path.resolve(__dirname, './assets')));
console.log(path.resolve(__dirname, './assets'));

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('./index');
});

app.use('/auth', authRoute);

app.use('/instructor', instructorRoute)

// app.listen(process.env.PORT || 3000, function() {
//   console.log('app.js:79 - The server is running on port 3000!');
// });

let server;

function runServer(databaseUrl = DATABASE_URL, port = 3000) {
  return new Promise((resolve, reject) => {
    console.log('app.js:86 - DATABASE_URL:', DATABASE_URL);
    mongoose.connect(mongoUrl, {
      useMongoClient: true
    }, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
          console.log(`app.js:94 - Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    }).catch((err) => {
      console.log(err);
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('app.js:110 - Closing server');
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
  runServer().catch(err => console.error("app.js:122", err));
};

module.exports = {
  runServer,
  app,
  closeServer
};

//https://sleepy-reef-69636.herokuapp.com/ | https://git.heroku.com/sleepy-reef-69636.git
