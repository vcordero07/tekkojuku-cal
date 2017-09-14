const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const instructor = require('../controllers/instructor.controller');

mongoose.Promise = global.Promise;

const {
  Instructor
} = require('../models/instructor.model');

router.get('/all', instructor.getAllInstructors);
router.get('/instructor/:id', instructor.getInstructorId);
router.post('/creator/', jsonParser, instructor.newInstructor);
router.put('/instructor/:id', jsonParser, instructor.updateInstructor);
router.delete('/instructor/:id', instructor.deleteInstructor);

module.exports = router;
