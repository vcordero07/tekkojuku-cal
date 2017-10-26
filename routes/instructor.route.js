const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const instructorController = require('../controllers/instructor.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;

router.get('/', instructorController.getAllInstructors);
router.get('/data', passport.authenticate('jwt', { session: false, failWithError: true }), instructorController.getAllInstructorsData);
router.get('/:id', passport.authenticate('jwt', { session: false, failWithError: true }), instructorController.getInstructorId);
router.post('/creator/', jsonParser, instructorController.newInstructor);
router.put('/:id', jsonParser, instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;
