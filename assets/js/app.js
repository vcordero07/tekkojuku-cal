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
      //-----------------------------------------SUCCESS AND ERROR ARE NOT WORKING

      // success: function(data) {
      //   console.log('app.js:35 - data:', data);
      //   if (!data.tkn) {
      //     console.log('app.js:37 - a');
      //     incorrectLogin();
      //   } else {
      //     console.log('app.js:40 - b:');
      //     $('.login-error').remove();
      //     localStorage.setItem('token', data.tkn);
      //     // $(location).attr('href', BASE_URL + '/calendar?auth_token=' + data.tkn);
      //     $(location).attr('href', BASE_URL + '/calendar');
      //     console.log('app.js:45 - location:', $(location).attr('href', BASE_URL + '/calendar'));
      //   }
      //
      // },
      // error: function(data, errorThrown) {
      //   alert("error");
      // }
    })
    .done((data) => {
      $.ajax({
        type: "GET",
        url: "/auth/getAuthToken",
      }).done(
        function(responseData) {
          localStorage.setItem("token", responseData.tkn);
          localStorage.setItem("uid", responseData.instructorID);
          // console.log('app.js:62 - responseData:', responseData);
          console.log('Login: successful', responseData);
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
      console.log('Signup: Successful', data);

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
      console.log('msg: User deleted', data);
      // alert('msg: User deleted', data);
      $(location).attr('href', '/instructors');
    });
}

let addClassEvent = () => {
  $.ajax({
      type: "post",
      url: `/calendar/class`,
      headers: {
        "Accept": "application/json",
      },
      data: {
        instructorID: "59f002a373e700306d593e9f",
        dateOccurence: new Date(),
        content: "test",
      }
    })
    .done((data) => {
      console.log('msg: class added', data);
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

let createEventListers = () => {
  console.log('app.js:11 - abcasdfasd');
  $('.tekkojuku_form_login').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('app.js:15 - info:', info);
    doLogin(auth);
  });
  $('.tekkojuku_form_signup').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('app.js:15 - info:', info);
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
        console.log('data: Successful', data);
        let instructorOpts = "";
        data.forEach(item => {
          instructorOpts += ` <option value="${item._id}">${item.username}</option>`
        })
        setTimeout(function() {
          $('select[name="instructors"]').html(instructorOpts)
        }, 500)
      });


    BootstrapDialog.show({
      title: `Add a new Class`,
      message: `loading...
      <br>
      Select an Instructor
      <select name="instructors">
      </select>
      <label class="checkbox-inline, class-content">
      <input type="checkbox" value="">Aikido
      </label>
      <label class="checkbox-inline, class-content">
      <input type="checkbox" value="">Iaido
      </label>
      <label class="checkbox-inline, class-content">
      <input type="checkbox" value="">Weapons
      </label>
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
    // console.log('app.js:194 - event:', event);
    // console.log('app.js:194 - data-userid:', event.currentTarget.attributes[0].value);
    // console.log('user img', $(event.currentTarget).find('img').attr('src'));
    // console.log('Name', $(event.currentTarget).find('.inst-name')[0].innerHTML);
    // console.log('Degree', $.trim($(event.currentTarget).find('.inst-degree')[0].innerHTML));
    console.log('id: ', $(event.currentTarget));
    console.log('id: ', $(event.currentTarget).find('id'));
    console.log('id: ', $(event.currentTarget).attr('id'));
    BootstrapDialog.show({
      title: `<img src="${$(event.currentTarget).find('img').attr('src')}" width="65" height="90"> Instructor ${$(event.currentTarget).find('.inst-name')[0].innerHTML}`,
      message: `Degree: ${$.trim($(event.currentTarget).find('.inst-degree')[0].innerHTML)}
    <br> Short Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consequat ornare mauris quis mollis. Nam quam magna, fermentum eget lacinia a, vehicula ut erat. Curabitur cursus ligula justo, nec feugiat leo rutrum eget. Morbi molestie lorem at sapien iaculis maximus. Morbi accumsan lacus et augue dignissim eleifend. Praesent erat arcu, blandit a enim sit amet, auctor hendrerit erat. Sed id lorem consequat, dapibus sem non, bibendum nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum tristique vel ante a venenatis.
    <br> Class:
    <br>`,
      type: BootstrapDialog.TYPE_PRIMARY,
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

  $('.event').on('click', (event) => {

    BootstrapDialog.show({
      title: `Event Info`,
      message: `blah blah blah blah
  <br>`,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }, {
        label: 'Delete',
        title: 'Delete Class',
        cssClass: 'btn-danger'
      }]
    });

  });


}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
