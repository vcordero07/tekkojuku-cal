const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { calendar } = require('../models/calendar.model')

const { app, runServer, closeServer } = require('../app');
const { DATABASE_URL } = require('../config');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedCalendarData() {
  qonsole.debug('test-Calendar.js:29 - seeding Tekkojuku cal app data');
  let seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    });
  }
  return Calendar.insertMany(seedData);
}

function tearDownDb() {
  console.warn('test-Calendar.js:42 - Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Calendar CRUD Methods', function() {
  before(function() {
    qonsole.debug('test-Calendar.js:48 - 1a');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    qonsole.debug('test-Calendar.js:53 - 1b');
    return seedCalendarData();
  });

  afterEach(function() {
    qonsole.debug('test-Calendar.js:58 - 1c');
    return tearDownDb();
  });

  after(function() {
    qonsole.debug('test-Calendar.js:63 - 1d');
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should return all existing calendar', function() {

      let res;
      return chai.request(app)
        .get('/calendar/')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Calendar.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
      // return true;
    });

  });

  it('should return calendar with right fields', function() {

    let cal;
    return chai.request(app)
      .get('/calendar/')
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length.of.at.least(1);

        res.body.forEach(item => {
          item.should.be.a('object');
          item.should.include.keys('_id', 'content', '_instructor', 'dateOccurrence', 'created');
        });

        cal = res.body[0];
        return Calendar.findById(cal._id);
      })
      .then(data => {
        cal.username.should.equal(data.username);
        cal.password.should.equal(data.password);
        cal.email.should.equal(data.email);
      });
    //  return true;
  });

  describe('DELETE endpoint', function() {
    it('delete a Calendar by id', function() {

      let inst;

      return Calendar
        .findOne()
        .then(data => {
          inst = data;
          return chai.request(app).delete(`/calendar/${inst._id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Calendar.findById(inst._id);
        })
        .then(data => {
          should.not.exist(data);
        });
      // return true;
    });
  });

});
