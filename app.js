require('dotenv').config()

let express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override')

let instructorRoute = require('./routes/instructor.route');
const mongoUrl = (process.env.MONGO_USE_LOCAL === 'true') ?
  (process.env.MONGO_LOCAL_URL) :
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_WEB_URL}${process.env.MONGO_DB}${process.env.MONGO_AUTH}`;
console.log(mongoUrl);
mongoose.connect(mongoUrl, {
  useMongoClient: true
}, (err) => {
  if (err) {
    console.error("Error connecting to mongo");
    throw err
  }
  console.log('Mongo is running at');
}).catch(err => {
  console.log(err);
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('./index');
});

app.use('/instructor', instructorRoute)

app.listen(process.env.PORT || 3000, function() {
  console.log('The server is running on port 3000!');
});

//https://sleepy-reef-69636.herokuapp.com/ | https://git.heroku.com/sleepy-reef-69636.git
