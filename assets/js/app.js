let hideShow = (toHide = [], toShow = []) => {
  toHide.forEach(function(item, indx) {
    $(item).hide()
  });
  toShow.forEach(function(item, indx) {
    $(item).show()
  });
};

let createEventListers = () => {
  console.log('app.js:11 - abcasdfasd');
  $('.tekkojuku_form_login').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('app.js:15 - info:', info);
    let accessToken;
    $.ajax({
        type: "POST",
        url: "/auth/login",
        headers: {
          "Authorization": "Basic " + auth,
          // "Content-Type": "application/json",
          "Accept": "application/json",
          // "Authorization": "OAuth oauth_token=ACCESSTOKEN"
        },
        data: {
          "username": $('#username').val(),
          "password": $('#password').val(),
          "email": $('#email').val()
        },
        // beforeSend: function(xhr) {
        //   xhr.setRequestHeader("Authorization", "Basic " + auth);
        // },
        success: function(data) {
          console.log('app.js:35 - data:', data);
          if (!data.tkn) {
            console.log('app.js:37 - a');
            incorrectLogin();
          } else {
            console.log('app.js:40 - b:');
            $('.login-error').remove();
            localStorage.setItem('token', data.tkn);
            // $(location).attr('href', BASE_URL + '/calendar?auth_token=' + data.tkn);
            $(location).attr('href', BASE_URL + '/calendar');
            console.log('app.js:45 - location:', $(location).attr('href', BASE_URL + '/calendar'));
          }

        },
        error: function(data, errorThrown) {
          alert("error");
        },
        datatype: "jsonp"
      })
      .done((data) => {
        // $.ajax({
        //   type: "GET",
        //   url: "/auth/getAuthToken",
        // }).done(
        //   function(responseData) {
        //     localStorage.setItem("token", responseData.tkn);
        //     localStorage.setItem("uid", responseData.instructorID);
        //     console.log('app.js:62 - responseData:', responseData);
        console.log('test: this is working', data);
        $(location).attr('href', '/calendar');
      });
  });

  function incorrectLogin() {
    $('.login-error').remove();
    $('.login').prepend('<span class="login-error">The username or password is incorrect. Please try again.');
  }

  function logoutUser() {
    localStorage.removeItem('authToken');
    $(location).attr('href', BASE_URL);
  }

  // $('.link-login').on('click', (event) => {
  //   // hideShow(['.link-login', '.btn-signup'], ['.link-signup', '.btn-login'])
  //   // $('.form-title').html('Login')
  // });
  //
  // $('.link-signup').on('click', (event) => {
  //   hideShow(['.link-signup', '.btn-login'], ['.link-login', '.btn-signup'])
  //   $('.form-title').html('Sign Up')
  // });
}


const renderApp = () => {
  // hideShow(['.link-login', '.logo-2', '.btn-signup'], ['.link-signup'])
  createEventListers();
};

$(document).ready(renderApp);
