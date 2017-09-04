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
  Instructor.find().exec().then(data => {
    res.status(200).json(data);
  });
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
});

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
  Instructor.delete(req.params.id);
  console.log(`Deleted instructor from the list \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;
