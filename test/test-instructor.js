const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  Instructor
} = require('../models/instructor.model')

const should = chai.should();

chai.use(chaiHttp);

describe('Instructor CRUD Methods', function() {

  it('it should create an Instructor', function(done) {
    const instructor = new Instructor({
      username: "testname",
      email: "testemail@gmail.com"
    });
    console.log("a");
    instructor.save().then(() => {
      instructor.isNew.should.equal(false);
      done();
    });
    console.log("b");
    done();
    //return true
  });


});
