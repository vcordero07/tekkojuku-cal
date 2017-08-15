let express = require('express'),
app = express(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
methodOverride = require('method-override')

let instructorRoute = require('./routes/instructor.route');

mongoose.connect('mongodb://localhost/tekkojuku-cal', {useMongoClient:true}, (err)=> {
  if (err) {
    console.error("Error connecting to mongo");
    throw err
  }
  console.log('Mongo is running at' );
})
;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('./index');
});



app.use('/instructor', instructorRoute)


//mongodb://vcordero07:T7ve9zBr3wRwUCDazkY3Jqy53jSqx2p@ds139619.mlab.com:39619/tekkojuku-cal






app.listen(process.env.PORT || 3000, function() {
  console.log('The server is running on port 3000!');
});
