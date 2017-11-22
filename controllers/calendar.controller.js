const { Calendar } = require('../models/calendar.model');
const { Instructor } = require('../models/instructor.model');

exports.getCalendar = (req, res) => {
  console.log('calendar.controller.js:4 - getCalendar:');
  Calendar.find().sort({ dateOccurrence: 1 }).populate({ path: "_instructor" }).exec().then(data => {

    let getCurrentTime = (myDate) => {
      let time = new Date(myDate);
      let hours = time.getUTCHours() > 12 ? time.getUTCHours() - 12 : time.getUTCHours();
      let am_pm = time.getUTCHours() >= 12 ? "PM" : "AM";
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = time.getUTCMinutes() < 10 ? "0" + time.getUTCMinutes() : time.getUTCMinutes();
      //   let seconds = time.getUTCSeconds() < 10 ? "0" + time.getUTCSeconds() : time.getUTCSeconds();
      time = hours + ":" + minutes + am_pm;
      return time;
    };

    let generateClasses = (item, indexOf) => {
      let monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      let d = new Date(item.dateOccurrence);
      let dateM = monthNames[d.getMonth()];
      let dateD = d.getDate();
      let dateT = getCurrentTime(item.dateOccurrence);
      let currClass = `<div class="event_icon"><div class="event_month ${item.content}">${dateD} ${dateM}</div>|<div class="event_day">${dateT}</div></div>`;
      // qonsole.debug('generateClasses currClass:', currClass);
      return currClass;
    }

    let allClasses = data.map(generateClasses);
    // let instructorsInfo = JSON.stringify(data); check this one out
    let calData = data;

    let fullCalendarEvents = [];
    let calendarData = {};

    calData.forEach(item => {

      var startFullCalDate = item.dateOccurrence.toISOString().substring(0, 19);

      console.log('startFullCalDate:', startFullCalDate, item.dateOccurrence);
      // console.log('endFullCalDate:', endFullCalDate);
      fullCalendarEvents.push(`{id: '${item._id}', title: '${item.content}', start: '${startFullCalDate}', className: 'full-cal-event-${item._id}'}`)
    });
    console.log(fullCalendarEvents);
    let classDataByID = { "render": false };
    calendarData = data;
    res.status(200).render('../views/calendar', { calendarData, allClasses, fullCalendarEvents, classDataByID });
  });
};

exports.getClass = (req, res) => {
  console.log('calendar.controller.js:7 - getClass:');
  // Calendar.find().sort({ dateOccurrence: 1 }).populate({ path: "_instructor" }).exec()
  Calendar.findById(req.params.id).populate({ path: "_instructor" }).exec().then((data) => {
      // res.status(200).json({ calendarData, "classDataByID": data, fullCalendarEvents });
      res.status(200).json({ "classDataByID": data });
    })
    .catch(err => {
      console.error('calendar.controller.js:16 - error get class', err);
      res.status(500).json({
        error: 'something went horribly awry'
      });
    });
};
exports.newClass = (req, res) => {
  console.log('calendar.controller.js:27 - newClass:');
  const requiredFields = ['content', 'dateOccurrence', 'instructorID'];
  console.log('calendar.controller.js:29 - requiredFields', requiredFields);
  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      let err = `Missing \`${field}\` in request body`;
      console.error('calendar.controller.js:32 - new class err', err);
      return res.status(400).send(err);
    }
  }
  //fix here
  Calendar.create({
      content: req.body.content,
      _instructor: req.body.instructorID,
      dateOccurrence: req.body.dateOccurrence
    })
    .then(data => {
      Instructor.findByIdAndUpdate(req.body.instructorID, { $push: { calendarRef: data._id } }, { upsert: true })
        .then(() => {
          res.status(201).json(data);
        })
        .catch(err => {
          console.error('calendar.controller.js50: error', err);
        })
    })
    .catch(err => {
      console.error('calendar.controller.js:45 - new class create err', err);
      res.status(500).json({ msg: 'Internal server error' });
    })
};
exports.updateClass = (req, res) => {
  console.log('calendar.controller.js:13 - updateClass:');
  Calendar.findByIdAndUpdate(req.params.id, {
      content: req.body.content,
      _instructor: req.body.instructorID,
      dateOccurrence: req.body.dateOccurrence
    }).then(data => {
      Instructor.findByIdAndUpdate(req.body.instructorID, { $push: { calendarRef: data._id } }, { upsert: true })
        .then(() => {
          res.status(201).json(data);
        })
        .catch(err => {
          console.error('calendar.controller.js50: error', err);
        })
    })
    .catch(err => {
      console.error('calendar.controller.js:38 - error update class', err);
    });
};
exports.deleteClass = (req, res) => {
  console.log('calendar.controller.js:16 - deleteClass:');
  Calendar.findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted class with id \`${req.params.ID}\``);
      res.status(204).json({ msg: 'success' });
    })
    .catch(err => {
      console.error('calendar.controller.js:48 - delete class err', err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
};
