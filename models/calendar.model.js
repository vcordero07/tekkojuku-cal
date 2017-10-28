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
  "dateOccurrence": {
    type: 'Date',
    required: true
  },
  "created": {
    type: "Date",
    required: true,
    default: Date.now
  }
});

calendarSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    content: this.content,
    _instructor: this._instructor,
    dateOccurrence: this.dateOccurrence,
    created: this.created
  };
}
const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = { Calendar };
