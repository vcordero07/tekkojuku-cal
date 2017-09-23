const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const instructorSchema = new Schema({
  "username": {
    type: 'String',
    required: true
  },
  "password": {
    type: 'String',
    required: true
  },
  "email": 'String',
  "created": {
    type: "Date",
    required: true,
    default: Date.now
  },
  "token": {
    type: "String"
  }
})

instructorSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.username,
    password: this.password,
    email: this.email,
    created: this.created
  };
}

instructorSchema.methods.getToken = function() {
  return instructorSchema.token;
};

instructorSchema.methods.setToken = function(token) {
  // return this; //console.log('this: ', this);
  instructorSchema.token = token;
  return true;
};

instructorSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

instructorSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = {
  Instructor
};
