const chai = require('chai');
const chaiHTTP = require('chai-http');

const should = chai.should();
const app = require('../server');

chai.use(chaiHTTP);

describe('Test', function() {
  it('should return a 200 status', function() {
    return chai.request.(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
      })
  })
})
