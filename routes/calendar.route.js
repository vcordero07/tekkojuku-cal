const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const calendarController = require('../controllers/calendar.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;

router.get('/', passport.authenticate('jwt', { session: false, failWithError: true }), calendarController.getCalendar);
router.get('/:id', passport.authenticate('jwt', { session: false, failWithError: true }), calendarController.getClass);
router.post('/class/', jsonParser, calendarController.newClass);
router.put('/:id', jsonParser, calendarController.updateClass);
router.delete('/:id', passport.authenticate('jwt', { session: false, failWithError: true }), calendarController.deleteClass);

module.exports = router;
