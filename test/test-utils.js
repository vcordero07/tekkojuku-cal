// const Mongoose = require('mongoose').Mongoose;
// const mongoose = new Mongoose();
//
// const Mockgoose = require('mockgoose').Mockgoose;
// const mockgoose = new Mockgoose(mongoose);
//
// mongoose.Promise = global.Promise;
//
// before(function(done) {
//   qonsole.debug("c");
//   mockgoose.prepareStorage().then(function() {
//     qonsole.debug('1');
//     mongoose.connect('mongodb://localhost/aikido-calendar_test', function(err) {
//       qonsole.debug("2");
//       done(err);
//     });
//   });
// });
//
// beforeEach((done) => {
//   qonsole.debug("d");
//   const {
//     collections
//   } = mongoose.connection;
//   const collectionKeys = Object.keys(collections);
//   let counter = 0;
//
//   function check() {
//     counter += 1;
//     if (counter === collectionKeys.length) {
//       done();
//     }
//     done();
//   }
//
//   collectionKeys.forEach((collection) => {
//     mongoose.connection.db.dropCollection(collection, (err, result) => {
//       check();
//     });
//   });
// });
