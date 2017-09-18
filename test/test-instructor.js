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
    console.log('1a');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    console.log('1b');
    return seedTekkojukuCalData();
  });

  afterEach(function() {
    console.log('1c');
    return tearDownDb();
  });

  after(function() {
    console.log('1d');
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

  it('should return posts with right fields', function() {

    let resPost;
    return chai.request(app)
      .get('/all')
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length.of.at.least(1);

        res.body.forEach(post => {
          post.should.be.a('object');
          post.should.include.keys('id', 'username', 'password', 'email', 'created');
        });

        resPost = res.body[0];
        return Instructor.findById(resPost.id);
      })
      .then(post => {
        resPost.username.should.equal(post.username);
        resPost.password.should.equal(post.password);
        resPost.email.should.equal(post.email);
      });
  });

});
