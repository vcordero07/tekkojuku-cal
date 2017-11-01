let hideShow = (toHide = [], toShow = []) => {
  toHide.forEach(function(item, indx) {
    $(item).hide()
  });
  toShow.forEach(function(item, indx) {
    $(item).show()
  });
};
let doLogin = (auth) => {
  $.ajax({
      type: "POST",
      url: "/auth/login",
      headers: {
        "Authorization": "Basic " + auth,
        "Accept": "application/json",
      },
      data: {
        "username": $('#username').val(),
        "password": $('#password').val(),
        "email": $('#email').val()
      },
      datatype: "jsonp",
    })
    .done((data) => {
      $.ajax({
        type: "GET",
        url: "/auth/getAuthToken",
      }).done(
        function(responseData) {
          localStorage.setItem("token", responseData.tkn);
          localStorage.setItem("uid", responseData.instructorID);
          // qonsole.debug('app.js:62 - responseData:', responseData);
          qonsole.debug('Login: successful', responseData);
          $(location).attr('href', '/calendar');
        })
    });
};
let doSignup = (auth, role = 3) => {
  $.ajax({
      type: "POST",
      url: "/instructors/creator",
      headers: {
        "Authorization": "Basic " + auth,
        "Accept": "application/json",
      },
      data: {
        "username": $('#username').val(),
        "password": $('#password').val(),
        "email": $('#email').val(),
        "role": role
      },
      datatype: "json",
    })
    .done((data) => {
      qonsole.debug('Signup: Successful', data);

      $(location).attr('href', '/instructors');
    });
}

let deleteUser = (userID) => {
  $.ajax({
      type: "delete",
      url: `/instructors/${userID}`,
      headers: {
        "Accept": "application/json",
      },
    })
    .done((data) => {
      qonsole.debug('msg: User deleted', data);
      // alert('msg: User deleted', data);
      $(location).attr('href', '/instructors');
    });
}

let deleteClasses = (list) => {
  list.forEach(item => {
    $.ajax({
        type: "delete",
        url: `/calendar/${item.clsVal}`,
        headers: {
          "Accept": "application/json",
        },
      })
      .done((data) => {
        qonsole.debug('msg: Classes deleted', data);
      });
  })

}

let addClassEvent = () => {
  let instID = $('select')["0"].value;
  qonsole.debug($('input[type=date]')["0"].value);
  qonsole.debug(`T${$('input[type=time]')["0"].value}:00.000Z`);
  qonsole.debug('instID:', instID);
  let classDateTime = `${$('input[type=date]')["0"].value}T${$('input[type=time]')["0"].value}:00.000Z`;
  $('')
  $.ajax({
      type: "post",
      url: `/calendar/class`,
      headers: {
        "Accept": "application/json",
      },
      data: {
        instructorID: instID,
        dateOccurrence: new Date(classDateTime),
        content: "Aikido",
      }
    })
    .done((data) => {
      qonsole.debug('msg: class added', data);
      // alert('msg: User deleted', data);
      //$(location).attr('href', '/instructors');
    });
}
let incorrectLogin = () => {
  $('.login-error').remove();
  $('.login').prepend('<span class="login-error">The username or password is incorrect. Please try again.');
}

let logoutUser = () => {
  localStorage.removeItem('authToken');
  $(location).attr('href', "/");
}

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
  let currClass = `<div class="event_icon"><div class="event_month">${dateD} ${dateM}</div><div class="event_day">${dateT}</div></div>`;
  // qonsole.debug('generateClasses currClass:', currClass);
  return currClass;
}

function getClasses(list) {
  // qonsole.debug('getClasses list:', list);
  return list.map(generateClasses);
}

function getClassesID(list) {
  let classID = [];
  qonsole.debug('getClassesID: ', list);
  // list.map((item, indexof) => {
  //   classID += `${item._id},`;
  // })
  list.forEach((val, key) => {
    classID.push({ clsKey: key, clsVal: val._id });
  })
  return classID;
}

let createEventListers = () => {
  qonsole.debug('app.js:11 - abcasdfasd');
  $('.tekkojuku_form_login').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //qonsole.debug('app.js:15 - info:', info);
    doLogin(auth);
  });
  $('.tekkojuku_form_signup').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //qonsole.debug('app.js:15 - info:', info);
    doSignup(auth);
  });

  // incorrectLogin()
  // logoutUser()

  $('.info-btn').on('click', (event) => {
    BootstrapDialog.show({
      title: `<img src="/img/tekkojuku-logo-inv.png" alt="Aikido Tekkojuku Logo" width="64" height="64"> Aikido Tekkojuku`,
      message: `Class Calendar
    <br> The purpose of this site is to allow the head instructor to automate the process of the monthly calendar class assignment.
    <br> Aikido Tekkojuku Boston (ATJB) was founded to promote the practice and teaching of the Japanese martial art of Aikido, as created by O Sensei Morihei Ueshiba, in an atmosphere of mutual respect conducive to training for all, irrespective of race,
      ethnicity, gender, ability or age. All seven founding instructors of ATJB were long-time students of the late Mitsunari Kanai Shihan, himself an "uchi deshi" (disciple) of Aikido's founder, O'Sensei Morihei Ueshiba. Kanai Shihan, a world-renowned
      Aikido practitioner and instructor, passed away in March of 2004. The founding instructors decided to honor his memory and love of Aikido by opening ATJB.`,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }]
    });
  });
  $('.add-instructor-btn').on('click', (event) => {
    BootstrapDialog.show({
      title: `Add Instructor`,
      message: `
    <br>
    <label for="username">Username</label>
    <input type="text" name="username" id="username" placeholder="instructorFoo">
    <label for="email">Email</label>
    <input type="email" name="email" id="email" placeholder="foo@bar.com" required>
    <label for="password">Password</label>
    <input type="password" name="password" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" id="password" placeholder="1234Pswd" required>
    `,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Submit',
        cssClass: 'btn-success',
        autospin: true,
        action: function(dialogRef) {
          event.preventDefault();

          let auth = btoa($('#username').val() + ':' + $('#password').val());
          doSignup(auth, 2);
          dialogRef.enableButtons(false);
          dialogRef.setClosable(false);
          dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
          setTimeout(function() {
            dialogRef.close();
          }, 5000);
        }
      }, {
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }]
    });
  });

  $('.add-event-btn').on('click', (event) => {

    $.ajax({
        type: "get",
        url: "/instructors/data",
        datatype: "json",
      })
      .done((data) => {
        qonsole.debug('data: Successful', data);
        let instructorOpts = "";
        data.forEach(item => {
          instructorOpts += ` <option value="${item._id}">${item.username}</option>`
        })
        setTimeout(function() {
          $('select[name="instructors"]').html(instructorOpts)
          qonsole.debug('select: ', $('select'));
        }, 3000)
      });


    BootstrapDialog.show({
      title: `Add a new Class`,
      message: `loading...
      Select an Instructor
      <select name="instructors">
      </select>
      <div class="btn-group class-content" role="group" aria-label="Class Content"><button type="button" class="btn btn-secondary">Aikido</button><button type="button" class="btn btn-secondary">Iaido</button><button type="button" class="btn btn-secondary">Weapons</button></div>
      <input type=date class="new-class-date">
      <input type=time min=9:00 max=17:00 step=900> `,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Submit',
        cssClass: 'btn-success',
        autospin: true,
        action: function(dialogRef) {
          addClassEvent();
          dialogRef.enableButtons(false);
          dialogRef.setClosable(false);
          dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
          setTimeout(function() {
            dialogRef.close();
          }, 5000);
        }
      }, {
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }]
    });
  });
  $('.degree-card').on('click', (event) => {
    qonsole.debug('app.js:194 - event:', event);
    // qonsole.debug('app.js:194 - data-userid:', event.currentTarget.attributes[0].value);
    // qonsole.debug('user img', $(event.currentTarget).find('img').attr('src'));
    // qonsole.debug('Name', $(event.currentTarget).find('.inst-name')[0].innerHTML);
    // qonsole.debug('Degree', $.trim($(event.currentTarget).find('.inst-degree')[0].innerHTML));
    let instClass, currClass, classesID;
    // qonsole.debug('id: ', $(event.currentTarget));
    // qonsole.debug('data-class: ', $(event.currentTarget).find('data-class').prevObject["0"].attributes[1].value);
    // qonsole.debug('id: ', $(event.currentTarget).attr('id'));
    setTimeout(function() {
      qonsole.debug($(event.currentTarget).find('.inst-classes').html());
    }, 500);



    console.log('instClass:', $.parseJSON($.trim($(event.currentTarget).find('.inst-classes').html())));
    instClass = $.parseJSON($.trim($(event.currentTarget).find('.inst-classes').html()));
    // qonsole.debug(instClass);
    console.log('instClass:', instClass);
    // setTimeout(function() {
    //     currClass = getClasses(instClass);
    //     console.log(currClass);
    //   }, 500)
    currClass = getClasses(instClass);
    classesID = getClassesID(instClass);
    // currClass = currClass.replace(/,/g, "");
    console.log("this is the current class", currClass);
    console.log("this is the current id", classesID);

    BootstrapDialog.show({
      title: `<img src="${$(event.currentTarget).find('img').attr('src')}" width="65" height="90"> Instructor ${$(event.currentTarget).find('.inst-name')[0].innerHTML}`,
      message: `Degree: ${$.trim($(event.currentTarget).find('.inst-degree')[0].innerHTML)}
      <br> Short Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consequat ornare mauris quis mollis. Nam quam magna, fermentum eget lacinia a, vehicula ut erat. Curabitur cursus ligula justo, nec feugiat leo rutrum eget. Morbi molestie lorem at sapien iaculis maximus. Morbi accumsan lacus et augue dignissim eleifend. Praesent erat arcu, blandit a enim sit amet, auctor hendrerit erat. Sed id lorem consequat, dapibus sem non, bibendum nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum tristique vel ante a venenatis.
      <br> Class:
      ${currClass}
      <br>`,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }, {
        label: 'Delete',
        title: 'Delete Instructor & Classes',
        cssClass: 'btn-danger',
        action: function(dialogRef) {
          let instID = $(event.currentTarget).attr('id');
          deleteClasses(classesID)
          deleteUser(instID)
          dialogRef.enableButtons(false);
          dialogRef.setClosable(false);
          dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
          setTimeout(function() {
            dialogRef.close();
          }, 5000);
        }
      }]
    });



  });

  $('.event').on('click', (event) => {
    qonsole.debug($.trim($(event.currentTarget).find('.event-type')));
    BootstrapDialog.show({
      title: `Event Info`,
      message: `blah blah blah blah
  <br>`,
      type: BootstrapDialog.TYPE_PRIMARY,
      // buttons: [{
      //   label: 'Close',
      //   title: 'Close',
      //   action: function(dialogRef) {
      //     dialogRef.close();
      //   }
      // }, {
      //   label: 'Delete',
      //   title: 'Delete Class',
      //   cssClass: 'btn-danger'
      // }]
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }, {
        label: 'Delete',
        title: 'Delete Instructor',
        cssClass: 'btn-danger',
        action: function(dialogRef) {
          deleteUser($(event.currentTarget).attr('id'))
          dialogRef.enableButtons(false);
          dialogRef.setClosable(false);
          dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
          setTimeout(function() {
            dialogRef.close();
          }, 5000);
        }
      }]
    });

  });
  qonsole.debug('test qonsole.debug')
}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
