const { Calendar } = require('../models/calendar.model');

exports.getCalendar = (req, res) => {
  console.log('calendar.controller.js:4 - getCalendar:');
  Calendar.find().exec().then(data => {
    res.status(200)..render('../views/calendar', data);
  });
};
exports.getClass = (req, res) => {
  console.log('calendar.controller.js:7 - getClass:');
  calendar
    .findById(req.params.id)
    .then((data) => {
      res.status(200).render('..view/calendar', {
        "calendarData": data
      });
    })
    .catch(err => {
      console.error('calendar.controller.js:16 - error get class', err);
      res.status(500).json({
        error: 'something went horribly awry'
      });
    });
};
exports.newClass = (req, res) => {
  console.log('calendar.controller.js:10 - newClass:');
  const requiredFields = ['content', 'dateOccurence', '_instructor'];
  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      let err = `Missing \`${field}\` in request body`;
      console.error('calendar.controller.js:32 - new class err', err);
      return res.status(400).send(err);
    }
  }
  return Calendar.create({
      content: req.body.content,
      _instructor: req.body._instructor,
      dateOccurence: req.body.dateOccurence
    })
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.error('calendar.controller.js:45 - new class create err', err);
      res.status(500).json({ msg: 'Internal server error' });
    })
};
exports.updateClass = (req, res) => {
  console.log('calendar.controller.js:13 - updateClass:');
  Calendar.findByIdAndUpdate(req.params.id, {
    content: req.body.content,
    _instructor: req.body._instructor,
    dateOccurrence: req.body.dateOccurrence
  }).then(data => {
    res.status(202).json(data);
  }).catch(err => {
    console.error('calendar.controller.js:38 - error update class', err);
  });
};
exports.deleteClass = (req, res) => {
  console.log('calendar.controller.js:16 - deleteClass:');
  Calendar.findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted class with id \`${req.params.ID}\``);
      res.status(204).json({ msg: 'success' });
    })
    .catch(err => {
      console.error('calendar.controller.js:48 - delete class err', err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
};
