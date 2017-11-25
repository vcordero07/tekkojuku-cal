const suRole = 1;
const inRole = 2;
const usRole = 3;

let hideShow = (toHide = [], toShow = []) => {
  toHide.forEach(function(item, indx) {
    $(item).hide()
  });
  toShow.forEach(function(item, indx) {
    $(item).show()
  });
};
let doLogin = (auth) => {
  //console.log('app.js doLogin auth:', auth);
  let doLoginJSONData = {
    "username": $('#username').val(),
    "password": $('#password').val(),
    // "email": $('#email').val()
  }
  $.ajax({
      type: "POST",
      url: "/auth/login",
      headers: {
        "Authorization": "Basic " + auth,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(doLoginJSONData),
      // datatype: "jsonp",
    })
    .done((data) => {
      //console.log('data:', data);
      $.ajax({
        type: "GET",
        url: "/auth/getAuthToken",
      }).done(
        function(responseData) {
          //console.log('app.js responseData:', responseData);
          localStorage.setItem("token", responseData.tkn);
          localStorage.setItem("uid", responseData.instructorID);
          // qonsole.debug('app.js:62 - responseData:', responseData);
          // qonsole.debug('Login: successful', responseData);
          $(location).attr('href', '/calendar');
        })
    });
};

let doSignup = (auth, role = usRole) => {
  //console.log('app.js doSignup:', auth, role);
  let doSignupJSONData = {
    "username": $('#username').val(),
    "password": $('#password').val(),
    "email": $('#email').val(),
    "role": role
  }
  $.ajax({
      type: "POST",
      url: "/instructors/creator",
      headers: {
        "Authorization": "Basic " + auth,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(doSignupJSONData),
      // datatype: "jsonp",
    })
    .done((data) => {
      // qonsole.debug('Signup: Successful', data);
      if (role === usRole) {
        doLogin(auth)
      }
      $(location).attr('href', '/instructors');
    });
}

let deleteUser = (userID) => {
  //console.log('app.js deleteUser:', userID);
  $.ajax({
      type: "delete",
      url: `/instructors/${userID}`,
      headers: {
        "Accept": "application/json",
      },
    })
    .done((data) => {
      // qonsole.debug('msg: User deleted', data);
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
        //qonsole.debug('msg: Classes deleted', data);
      });
  })

}

let deleteClassByID = (classID) => {
  $.ajax({
      type: "delete",
      url: `/calendar/${classID}`,
      headers: {
        "Accept": "application/json",
      },
    })
    .done((data) => {
      // qonsole.debug('msg: Class deleted', data);
      $(location).attr('href', '/calendar');
    });
}

let updateClassEventByID = (classID) => {
  //console.log('classID:', classID);
  let instID = $('select')["0"].value;
  //console.log($('input[type=date]')["0"].value);
  //console.log(`T${$('input[type=time]')["0"].value}:00.000Z`);
  // console.log('instID:', instID);
  let classDateTime = `${$('input[type=date]')["0"].value}T${$('input[type=time]')["0"].value}:00.000Z`;
  let classType = $('.active input').prop('id');
  //console.log('classType:', classType, classDateTime, instID);
  $.ajax({
      type: "PUT",
      url: `/calendar/${classID}`,
      headers: {
        "Accept": "application/json",
      },
      data: {
        instructorID: instID,
        dateOccurrence: new Date(classDateTime),
        content: `${classType}`,
      }
    })
    .done((data) => {
      //console.log('msg: class updated by id', data);
      // alert('msg: User deleted', data);
      $(location).attr('href', '/calendar');
    });
}

let addClassEvent = () => {
  let instID = $('select')["0"].value;
  // qonsole.debug($('input[type=date]')["0"].value);
  // qonsole.debug(`T${$('input[type=time]')["0"].value}:00.000Z`);
  // qonsole.debug('instID:', instID);
  let classDateTime = `${$('input[type=date]')["0"].value}T${$('input[type=time]')["0"].value}:00.000Z`;
  let classType = $('.active input').prop('id');
  //console.log('classType:', classType);
  // $('')
  $.ajax({
      type: "post",
      url: `/calendar/class`,
      headers: {
        "Accept": "application/json",
      },
      data: {
        instructorID: instID,
        dateOccurrence: new Date(classDateTime),
        content: `${classType}`,
      }
    })
    .done((data) => {
      // qonsole.debug('msg: class added', data);
      // alert('msg: User deleted', data);
      $(location).attr('href', '/calendar');
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

let getConvertTimeTo24 = (myDate) => {
  //console.log('mydate:', myDate);
  let time = new Date(myDate);
  let hours = time.getUTCHours() > 12 ? time.getUTCHours() - 12 : time.getUTCHours();
  let am_pm = time.getUTCHours() >= 12 ? "PM" : "AM";
  hours = hours < 10 ? "0" + hours : hours;
  let minutes = time.getUTCMinutes() < 10 ? "0" + time.getUTCMinutes() : time.getUTCMinutes();
  time = hours + ":" + minutes + " " + am_pm;
  //console.log('time:', time);
  const [ntime, nmodifier] = time.split(' ');
  let [nhours, nminutes] = ntime.split(':');

  if (nhours === '12') {
    nhours = '00';
  }

  if (nmodifier === 'PM') {
    nhours = parseInt(nhours, 10) + 12;
  }
  //console.log("24time:", nhours + ':' + nminutes);
  return nhours + ':' + nminutes;
};

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
  let currClass = `<div class="event_icon"><div class="event_month ${item.content}">${dateD} ${dateM}</div><div class="event_day">${dateT}</div></div>`;
  // qonsole.debug('generateClasses currClass:', currClass);
  return currClass;
}

function getClasses(list) {
  // qonsole.debug('getClasses list:', list);
  return list.map(generateClasses);
}

function getClassesID(list) {
  let classID = [];
  // qonsole.debug('getClassesID: ', list);

  list.forEach((val, key) => {
    classID.push({ clsKey: key, clsVal: val._id });
  })
  return classID;
}

let createEventListers = () => {
  // qonsole.debug('app.js:11 - abcasdfasd');
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


  $('.info-btn').on('click', (event) => {
    BootstrapDialog.show({
      title: `<img src="/img/tekkojuku-logo-inv.png" alt="Aikido Tekkojuku Logo" width="64" height="64"> Aikido Tekkojuku`,
      message: `Class Calendar
    <br> The purpose of this site is to allow the head instructor to automate the process of the monthly calendar class assignment. You can view, add, edit, and delete classes by going to the Calendar page. To add classes, simply click on "Add Class" and fill the requirements. You can add an Instructor by clicking on the "add Instructor" button, and view his information by clicking on his picture.
    <br> Aikido Tekkojuku Boston (ATJB) was founded to promote the practice and teaching of the Japanese martial art of Aikido, as created by O Sensei Morihei Ueshiba, in an atmosphere of mutual respect conducive to training for all, irrespective of race, ethnicity, gender, ability or age. For more on information, go to <a href="http://aikidotjboston.org/">aikidotjboston.org</a>

    &copy Tekkojuku-Cal by <a href="https://github.com/vcordero07/tekkojuku-cal">Virgilio Cordero</a> |
      `,
      type: BootstrapDialog.TYPE_PRIMARY,
      cssClass: 'bs-dialog',
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
      cssClass: 'bs-dialog',
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }, {
        label: 'Submit',
        cssClass: 'btn-primary',
        autospin: true,
        action: function(dialogRef) {
          event.preventDefault();

          let auth = btoa($('#username').val() + ':' + $('#password').val());
          doSignup(auth, inRole);
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

  $('.add-event-btn').on('click', (event) => {

    $.ajax({
        type: "get",
        url: "/instructors/data",
        datatype: "json",
      })
      .done((data) => {
        // qonsole.debug('data: Successful', data);
        let instructorOpts = "";
        data.forEach(item => {
          instructorOpts += ` <option value="${item._id}">${item.username}</option>`
        })
        setTimeout(function() {
          $('select[name="instructors"]').html(instructorOpts)
          // qonsole.debug('select: ', $('select'));
        }, 500)
      });


    BootstrapDialog.show({
      title: `Add a new Class`,
      message: `
      Select an Instructor:
      <select name="instructors">
      </select>

      Class Type:
      <div class="btn-group" data-toggle="buttons">
      <label type="button" class="btn btn-secondary active class-content"><input type="radio" name="options" id="Aikido" autocomplete="off" checked>Aikido</label><label type="button" class="btn btn-secondary class-content"><input type="radio" name="options" id="Iaido" autocomplete="off">Iaido</label><label type="button" class="btn btn-secondary class-content"><input type="radio" name="options" id="Weapons" autocomplete="off">Weapons</label></div>

      Date: <input type=date class="new-class-date">
      Time: <input type=time min=9:00 max=17:00 step=900> `,
      type: BootstrapDialog.TYPE_PRIMARY,
      cssClass: 'bs-dialog',
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }, {
        label: 'Submit',
        cssClass: 'btn-primary',
        autospin: true,
        action: function(dialogRef) {
          addClassEvent();
          dialogRef.enableButtons(false);
          dialogRef.setClosable(false);
          dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
          setTimeout(function() {
            dialogRef.close();
          }, 1000);
        }
      }]
    });
  });

  $('.degree-card').on('click', (event) => {
    // qonsole.debug('app.js:194 - event:', event);
    let instClass, currClass, classesID, concatClasses = "";
    instClass = $.parseJSON($.trim($(event.currentTarget).find('.inst-classes').html()));
    currClass = getClasses(instClass);

    classesID = getClassesID(instClass);

    currClass.forEach(item => {
      concatClasses += item;
    })
    BootstrapDialog.show({
      title: `<img src="${$(event.currentTarget).find('img').attr('src')}" width="65" height="90"> Instructor ${$(event.currentTarget).find('.inst-name')[0].innerHTML}`,
      message: `Degree: ${$.trim($(event.currentTarget).find('.inst-degree')[0].innerHTML)}
      <br> Short Bio: ${$(event.currentTarget).find('.inst-bio').html()}
      Class:
      ${concatClasses}
      <br>
      <br>
      <br>
      <br>`,
      type: BootstrapDialog.TYPE_PRIMARY,
      cssClass: 'bs-dialog',
      buttons: [{
          label: 'Close',
          action: function(dialogRef) {
            dialogRef.close();
          }
        }
        // , {
        //   label: 'Edit',
        //   cssClass: 'btn-primary',
        //   action: function(dialogRef) {
        //     dialogRef.close();
        //   }
        // }
        , {
          label: 'Delete',
          title: 'Delete Instructor & Classes',
          cssClass: 'btn-primary',
          action: function(dialogRef) {
            // let instID = $(event.currentTarget).attr('id');
            // // deleteClasses(classesID)
            // deleteUser(instID)
            // dialogRef.enableButtons(false);
            // dialogRef.setClosable(false);
            dialogRef.close();
            BootstrapDialog.show({
              label: 'Warning',
              title: 'Warning',
              type: BootstrapDialog.TYPE_WARNING,
              message: 'Only the super-user can delete an Instructor'
            });
            dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
            setTimeout(function() {
              dialogRef.close();
            }, 5000);
          }
        }
      ]
    });



  });
  // console.log($('.full-cal-event-listener'));
  $('.event, .full-cal-event-listener').on('click', (event) => {
    let instInfo = JSON.parse($(event.currentTarget).find('.inst-info').html());
    let eventID = $(event.currentTarget).attr('id');
    if (instInfo === null) {
      BootstrapDialog.show({
        title: `Event Info: ${$(event.currentTarget).find('.event_month').html()} @ ${$(event.currentTarget).find('.event_day').html()}`,
        message: `There was an error trying to load this instructor. Please try again.
    <br>`,
        type: BootstrapDialog.TYPE_PRIMARY,
        cssClass: 'bs-dialog',
        buttons: [{
          label: 'Close',
          action: function(dialogRef) {
            dialogRef.close();
          }
        }, {
          label: 'Edit',
          cssClass: 'btn-primary',
          action: function(dialogRef) {
            dialogRef.close();
          }
        }, {
          label: 'Delete',
          title: 'Delete Instructor',
          cssClass: 'btn-primary',
          action: function(dialogRef) {
            deleteClassByID($(event.currentTarget).attr('id'))
            dialogRef.enableButtons(false);
            dialogRef.setClosable(false);
            dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
            setTimeout(function() {
              dialogRef.close();
            }, 5000);
          }
        }]
      });
    } else {
      BootstrapDialog.show({
        title: `Event Info: ${$(event.currentTarget).find('.event_month').html()} @ ${$(event.currentTarget).find('.event_day').html()}`,
        message: `${$(event.currentTarget).find('.event_type').html()} Class:
        <div class="event_icon"><div class="event_month ${$(event.currentTarget).find('.event_type').html()}">${$(event.currentTarget).find('.event_month').html()}</div><div class="event_day">${$(event.currentTarget).find('.event_day').html()}</div></div>


        Instructor:
        <img src="${instInfo.img}" width="65" height="90">
        ${instInfo.username}
        Degree: ${instInfo.degree}
    <br>`,
        type: BootstrapDialog.TYPE_PRIMARY,
        cssClass: 'bs-dialog',
        buttons: [{
          label: 'Close',
          action: function(dialogRef) {
            dialogRef.close();
          }
        }, {
          label: 'Edit',
          cssClass: 'btn-primary',
          action: function(dialogRef) {
            dialogRef.close();

            var date = new Date($(event.currentTarget)["0"].attributes[2].value);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            var dateStr = date.toISOString().substring(0, 10);
            var timeStr = getConvertTimeTo24($(event.currentTarget)["0"].attributes[2].value);
            //console.log('dateStr:', dateStr);
            //console.log('timeStr:', timeStr);
            $.ajax({
                type: "get",
                url: "/instructors/data",
                datatype: "json",
              })
              .done((data) => {
                // qonsole.debug('data: Successful', data);
                let instructorOpts = "";
                data.forEach(item => {
                  instructorOpts += ` <option value="${item._id}">${item.username}</option>`
                })
                setTimeout(function() {
                  $('select[name="instructors"]').html(instructorOpts)
                  // qonsole.debug('select: ', $('select'));
                }, 500)
              });


            BootstrapDialog.show({
              title: `Edit Class:`,
              message: `
              Select an Instructor:
              <select name="instructors">
              </select>

              Class Type:
              <div class="btn-group" data-toggle="buttons">
              <label type="button" class="btn btn-secondary active class-content"><input type="radio" name="options" id="Aikido" autocomplete="off" checked>Aikido</label><label type="button" class="btn btn-secondary class-content"><input type="radio" name="options" id="Iaido" autocomplete="off">Iaido</label><label type="button" class="btn btn-secondary class-content"><input type="radio" name="options" id="Weapons" autocomplete="off">Weapons</label></div>

              Date: <input type=date class="new-class-date" value="${dateStr}">
              Time: <input type=time min=9:00 max=17:00 step=900 value="${timeStr}"> `,
              type: BootstrapDialog.TYPE_PRIMARY,
              cssClass: 'bs-dialog',
              buttons: [{
                label: 'Close',
                action: function(dialogRef) {
                  dialogRef.close();
                }
              }, {
                label: 'Submit',
                cssClass: 'btn-primary',
                autospin: true,
                action: function(dialogRef) {
                  updateClassEventByID(eventID);
                  dialogRef.enableButtons(false);
                  dialogRef.setClosable(false);
                  dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
                  setTimeout(function() {
                    dialogRef.close();
                  }, 1000);
                }
              }]
            });
          }
        }, {
          label: 'Delete',
          title: 'Delete Instructor',
          cssClass: 'btn-primary',
          action: function(dialogRef) {
            deleteClassByID($(event.currentTarget).attr('id'))
            dialogRef.enableButtons(false);
            dialogRef.setClosable(false);
            dialogRef.getModalBody().html('Dialog closes in 5 seconds.');
            setTimeout(function() {
              dialogRef.close();
            }, 5000);
          }
        }]
      });
    }


  });
  // qonsole.debug('test qonsole.debug')
}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
