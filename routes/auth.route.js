const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const jwt = require('jsonwebtoken');

const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const auth = require('../controllers/auth.controller');

router.post('/login/', passport.authenticate('basic', { session: false }), auth.login);
// router.post('/login/', auth.login);

// router.post('/refresh', passport.authenticate('jwt', {
//     session: false
//   }),
//   (req, res) => {
//     const authToken = createAuthToken(req.user);
//     res.json({
//       authToken
//     });
//   }
// );

router.get('/getAuthToken/', auth.getAuthToken);
module.exports = router;
