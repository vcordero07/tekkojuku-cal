const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {
  Instructor
} = require('../models/instructor.model')

const {
  app,
  runServer,
  closeServer
} = require('../app');

const {
  DATABASE_URL
} = require('../config');

const {
  TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);

function seedTekkojukuCalData() {
  console.log('seeding Tekkojuku cal app data');
  let seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    });
  }
  return Instructor.insertMany(seedData);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Instructor CRUD Methods', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogAppData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should return all existing posts', function() {

      let res;
      return chai.request(app)
        .get('/all')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Instructor.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });

  });

  // it('it should create an Instructor', function(done) {
  //   const instructor = new Instructor({
  //     username: "testname",
  //     email: "testemail@gmail.com"
  //   });
  //   console.log("a");
  //   instructor.save().then(() => {
  //     instructor.isNew.should.equal(false);
  //     done();
  //   });
  //   console.log("b");
  //   done();
  //return true
  // });


});
