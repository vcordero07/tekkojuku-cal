let mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  "username": {
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

export default mongoose.model('User', userSchema);
