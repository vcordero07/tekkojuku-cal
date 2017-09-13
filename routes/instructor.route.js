let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const instructor = require('../controllers/instructor.controller')

mongoose.Promise = global.Promise;

const {
  Instructor
} = require('../models/instructor.model');

router.get('/all', (req, res) => {
  Instructor.find().exec().then(data => {
    res.status(200).json(data);
  });
});

router.get('/instructor/:id', (req, res) => {
  res.render('../views/instructor', {
    "instructor": req.params.id
  })
});

router.post('/creator/', jsonParser, instructor.newInstructor);

router.put('/instructor/:id', jsonParser, (req, res) => {
  Instructor.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    username: req.body.username
  }).then(data => {
    res.status(202).json(data);
  }).catch(err => {
    console.log(err);
  });
});

router.delete('/instructor/:id', (req, res) => {
  Instructor.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted instructor from the list \`${req.params.id}\``);
    res.status(204).end();
  });
});

module.exports = router;
