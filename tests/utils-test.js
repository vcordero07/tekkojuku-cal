const chai = require('chai');
const chaiHTTP = require('chai-http');

const should = chai.should();
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHTTP);

function tearDownDb() {
  console.warn('test-instructor.js:42 - Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Ultis Test', function() {
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
  });
})

describe('Test', function() {
  it('should return a 200 status', function() {
    return chai.request(app).get('/').then(function(res) {
        res.should.have.status(200);
      })
  })
});
