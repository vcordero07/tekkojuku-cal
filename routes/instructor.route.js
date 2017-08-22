let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

const {
  Instructor
} = require('../models/instructor.model');

router.get('/all', (req, res) => {
  res.json({
    "instructors": "all"
  })
});

router.get('/instructor/:id', (req, res) => {
  res.render('../views/instructor', {
    "instructor": req.params.id
  })
});

router.post('/creator/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['username', 'email'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Instructor.create({
    username: req.body.username,
    email: req.body.email
  }).then(item => {
    res.status(201).json(item);
  });

  // Instructor.create({
  //   username: req.body.username,
  //   email: req.body.email
  // }, function(err, instructor) {
  //   res.status(203).json(instructor);
  // })

});

module.exports = router;
