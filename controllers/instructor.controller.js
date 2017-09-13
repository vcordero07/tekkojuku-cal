const {
  Instructor
} = require('../models/instructor.model');

exports.newInstructor = (req, res) => {
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
};
