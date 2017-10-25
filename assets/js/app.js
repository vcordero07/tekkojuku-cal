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
let doSignup = (auth) => {
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
        "email": $('#email').val()
      },
      datatype: "json",
    })
    .done((data) => {
      console.log('Signup: Successful', data);

      $(location).attr('href', '/instructors');
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
      title: `<img src="/img/tekkojuku-logo.png" alt="Aikido Tekkojuku Logo" width="64" height="64"> <div><span >Aikido Tekkojuku Class Calendar</span></div>`,
      message: `BLAH BLAH BLAH BLAH
    <br> `,
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
    <button type="submit" name="button" class="btn-signup">Sign Up</button>
    `,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Submit',
        cssClass: 'btn-success',
        autospin: true,
        action: function(dialogRef) {
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
    <input type=date>
<input type=time min=9:00 max=17:00 step=900> `,
      type: BootstrapDialog.TYPE_DANGER,
      buttons: [{
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
    BootstrapDialog.show({
      title: `<img src="${$(event.currentTarget).find('img').attr('src')}" width="65" height="90"> Instructor ${$(event.currentTarget).find('.inst-name')[0].innerHTML}`,
      message: `Degree: ${$.trim($(event.currentTarget).find('.inst-degree')[0].innerHTML)}
    <br> Short Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consequat ornare mauris quis mollis. Nam quam magna, fermentum eget lacinia a, vehicula ut erat. Curabitur cursus ligula justo, nec feugiat leo rutrum eget. Morbi molestie lorem at sapien iaculis maximus. Morbi accumsan lacus et augue dignissim eleifend. Praesent erat arcu, blandit a enim sit amet, auctor hendrerit erat. Sed id lorem consequat, dapibus sem non, bibendum nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum tristique vel ante a venenatis.`,
      type: BootstrapDialog.TYPE_PRIMARY,
      buttons: [{
        label: 'Close',
        action: function(dialogRef) {
          dialogRef.close();
        }
      }]
    });
  });



}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
