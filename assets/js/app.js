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

  function incorrectLogin() {
    $('.login-error').remove();
    $('.login').prepend('<span class="login-error">The username or password is incorrect. Please try again.');
  }

  function logoutUser() {
    localStorage.removeItem('authToken');
    $(location).attr('href', BASE_URL);
  }
}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
