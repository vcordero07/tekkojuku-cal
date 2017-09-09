var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

mongoose.Promise = global.Promise;

before(function(done) {
  console.log("c");
  mockgoose.prepareStorage().then(function() {
    console.log('1');
    mongoose.connect('mongodb://localhost/aikido-calendar_test', function(err) {
      console.log("2");
      done(err);
    });
  });
});
// mockgoose.prepareStorage().then(() => {
// 	mongoose.connect('mongodb://localhost/aikido-calendar_test');
// 	mongoose.connection.on('connected', () => {
// 	  console.log('db connection is now open');
// 	});
// });
//
//
// before((done) => {
//   mongoose.connect('mongodb://localhost/aikido-calendar_test');
//   mongoose.connection
//     .once('open', () => { //mongoose .once **
//       return done();
//     })
//     .on('error', (error) => {
//       console.warn('Warning', error);
//     });
// });

beforeEach((done) => {
  console.log("d");
  const {
    collections
  } = mongoose.connection;
  const collectionKeys = Object.keys(collections);
  let counter = 0;

  function check() {
    counter += 1;
    if (counter === collectionKeys.length) {
      done();
    }
    done();
  }

  collectionKeys.forEach((collection) => {
    mongoose.connection.db.dropCollection(collection, (err, result) => {
      check();
    });
  });
});
