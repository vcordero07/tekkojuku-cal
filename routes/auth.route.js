const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const auth = require('../controllers/auth.controller');

router.post('/login/', jsonParser, auth.login);

module.exports = router;
