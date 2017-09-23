const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const auth = require('../controllers/auth.controller');

router.post('/login/', passport.authenticate('basic', {
  session: false
}), auth.login);

router.get('/getAuthToken/', auth.getAuthToken);
module.exports = router;
