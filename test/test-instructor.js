const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  Instructor
} = require('../models/instructor.model')
// const {
//   app,
//   runServer,
//   closeServer
// } = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Instructor CRUD Methods', function() {
  // before(function() {
  //   return runServer();
  // });
  //
  // after(function() {
  //   return closeServer();
  // });

  it('it should create an Instructor', function(done) {
    const instructor = new Instructor({
      username: "testname",
      email: "testemail@gmail.com"
    });
    instructor.save().then(() => {
      instructor.isNew.should.equal(false);
      done()
    });

    //return true
  });


});
