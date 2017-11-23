const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Instructor } = require('../models/instructor.model')

const { app, runServer, closeServer } = require('../app');
const { DATABASE_URL } = require('../config');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedInstructorData() {
  qonsole.debug('test-instructor.js:29 - seeding Tekkojuku cal app data');
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
  console.warn('test-instructor.js:42 - Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Instructor CRUD Methods', function() {
  before(function() {
    qonsole.debug('test-instructor.js:48 - 1a');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    qonsole.debug('test-instructor.js:53 - 1b');
    return seedInstructorData();
  });

  afterEach(function() {
    qonsole.debug('test-instructor.js:58 - 1c');
    return tearDownDb();
  });

  after(function() {
    qonsole.debug('test-instructor.js:63 - 1d');
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should return all existing instructors', function() {

      let res;
      return chai.request(app)
        .get('/instructors/')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Instructor.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
      // return true;
    });

  });

  it('should return instructors with right fields', function() {

    let resInstructor;
    return chai.request(app)
      .get('/instructors/')
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length.of.at.least(1);

        res.body.forEach(item => {
          item.should.be.a('object');
          item.should.include.keys('_id', 'username', 'password', 'email', 'created');
        });

        resInstructor = res.body[0];
        return Instructor.findById(resInstructor._id);
      })
      .then(data => {
        resInstructor.username.should.equal(data.username);
        resInstructor.password.should.equal(data.password);
        resInstructor.email.should.equal(data.email);
      });
    //  return true;
  });

  describe('DELETE endpoint', function() {
    it('delete a Instructor by id', function() {

      let inst;

      return Instructor
        .findOne()
        .then(data => {
          inst = data;
          return chai.request(app).delete(`/instructors/${inst._id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Instructor.findById(inst._id);
        })
        .then(data => {
          should.not.exist(data);
        });
      // return true;
    });
  });

});
