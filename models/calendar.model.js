const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
  "content": {
    type: 'String',
    required: true
  },
  "_instructor": {
    type: Schema.ObjectId,
    ref: 'Instructor'
  },
  "dateOccurence": {
    type: 'Date',
    required: true
  },
  "created": {
    type: "Date",
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Calendar', calendarSchema);
