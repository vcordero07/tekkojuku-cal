const { Instructor } = require('../models/instructor.model');
const { Calendar } = require('../models/calendar.model');

exports.newInstructor = (req, res) => {
  console.log("instructor.controller.js:6", req.body);
  req.body.role = parseInt(req.body.role);
  const requiredFields = ['username', 'email', 'password'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error("instructor.controller.js:12", message);
      return res.status(400).send(message);
    }
  }
  return Instructor.hashPassword(req.body.password)
    .then((hash) => {
      Instructor.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role
      }).then(item => {
        res.status(201).json(item);
      })
      // .catch(err => {
      //   console.error("instructor.controller.js:26", err);
      //   res.status(500).json({
      //     error: 'Something went wrong'
      //   });
      // });
    })
};

exports.getAllInstructors = (req, res) => {
  let instInfo = {};
  Instructor.find({ "role": { $lt: 3 } }).populate("calendarRef").exec().then(data => {
    console.log('instructor.controller.js:34 -data', data);
    instInfo = data;
    res.status(200).render('../views/instructors', {
      "instructorData": instInfo
    })
  });
};

exports.getAllInstructorsData = (req, res) => {
  let instInfo = {};
  Instructor.find().exec().then(data => {
    console.log('instructor.controller.js:34 -data', data);
    instInfo = data;
    res.status(200).json(instInfo);
  });
};

exports.getInstructorId = (req, res) => {
  console.log('instructor.controller.js:56 - req, res:', req, res);
  Instructor
    .findById(req.params.id)
    .then((data) => {
      res.status(200).render('../views/instructors', {
        "instructorData": data
      });
    })
    .catch(err => {
      console.error("instructor.controller.js:66", err);
      res.status(500).json({
        error: 'something went horribly awry'
      });
    });
};

exports.updateInstructor = (req, res) => {
  Instructor.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    username: req.body.username
  }).then(data => {
    res.status(202).json(data);
  }).catch(err => {
    console.log("instructor.controller.js:84 - err", err);
  });
};


exports.deleteInstructor = (req, res) => {
  Instructor.findByIdAndRemove(req.params.id).then(() => {
    console.log(`instructor.controller.js:114 - Deleted instructor from the list \`${req.params.id}\``);
    // res.status(204).end();

  }).then(() => {
    Calendar.remove({ _instructor: req.params.id }).then(() => {
      res.status(204).end();
    })
  });
};
