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

exports.getAllInstructors = (req, res) => {
  Instructor.find().exec().then(data => {
    res.status(200).json(data);
  });
};

exports.getInstructorId = (req, res) => {
  res.render('../views/instructor', {
    "instructor": req.params.id
  })
};

exports.updateInstructor = (req, res) => {
  Instructor.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    username: req.body.username
  }).then(data => {
    res.status(202).json(data);
  }).catch(err => {
    console.log(err);
  });
};


exports.deleteInstructor = (req, res) => {
  Instructor.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted instructor from the list \`${req.params.id}\``);
    res.status(204).end();
  });
};
