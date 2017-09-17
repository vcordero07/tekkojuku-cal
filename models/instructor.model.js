const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  }
})

instructorSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.authorName,
    password: this.content,
    email: this.title,
    created: this.created
  };
}

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = {
  Instructor
};
