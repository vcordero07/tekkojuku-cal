const { Instructor } = require('../models/instructor.model');

exports.newInstructor = (req, res) => {
  console.log("instructor.controller.js:6", req.body);
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
        password: hash
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
  Instructor.find().exec().then(data => {
    res.status(200).json(data);
  });
};

// exports.getInstructor = (req, res) => {
//   Instructor
//     .find()
//     .then(users => {
//       res.json(users.map(user => user.apiRepr()));
//     })
//     .catch(err => {
//       console.error("instructor.controller.js:47", err);
//       res.status(500).json({
//         error: 'something went terribly wrong'
//       });
//     });
// };

exports.getInstructorId = (req, res) => {
  // res.render('../views/instructor', {
  //   "instructor": req.params.id
  // })
  console.log('req, res:', req, res);
  Instructor
    .findById(req.params.id)
    .then((data) => {
      res.status(200).render('../views/instructor', {
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

exports.createInstructor = (req, res) => {

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
  // const requiredFields = ['username', 'password', 'email'];
  // for (let i = 0; i < requiredFields.length; i++) {
  //   const field = requiredFields[i];
  //   if (!(field in req.body)) {
  //     const message = `Missing \`${field}\` in request body`
  //     console.error("instructor.controller.js:91 - message", message);
  //     return res.status(400).send(message);
  //   }
  // }
  //
  // Instructor
  //   .create({
  //     username: req.body.username,
  //     password: req.body.password,
  //     email: req.body.email
  //   })
  //   .then(user => res.status(201).json(user.apiRepr()))
  //   .catch(err => {
  //     console.error("instructor.controller.js:104", err);
  //     res.status(500).json({
  //       error: 'Something went wrong'
  //     });
  //   });
};


exports.deleteInstructor = (req, res) => {
  Instructor.findByIdAndRemove(req.params.id).then(() => {
    console.log(`instructor.controller.js:114 - Deleted instructor from the list \`${req.params.id}\``);
    res.status(204).end();
  });
};
