let express = require('express');
let mongoose = require('mongoose');

let router = express.Router();

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



module.exports = router;
