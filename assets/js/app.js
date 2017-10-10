let hideShow = (toHide = [], toShow = []) => {
  toHide.forEach(function(item, indx) {
    $(item).hide()
  });
  toShow.forEach(function(item, indx) {
    $(item).show()
  });
};

let createEventListers = () => {
  console.log('app.js:2 - abcasdfasd');
  $('.tekkojuku_form').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('info:', info);
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
          console.log('data:', data);
          if (!data.tkn) {
            incorrectLogin();
          } else {
            $('.login-error').remove();
            localStorage.setItem('token', data.tkn);
            $(location).attr('href', BASE_URL + '/browse?auth_token=' + data.tkn);
          }

        },
        error: function(data, errorThrown) {
          alert("error");
        },
        datatype: "jsonp"
      })
      .done((data) => {
        $.ajax({
          type: "GET",
          url: "/auth/getAuthToken",
        }).done(
          function(responseData) {
            localStorage.setItem("token", responseData.tkn);
            localStorage.setItem("uid", responseData.instructorID);
            console.log('app.js:36 - responseData:', responseData);
          });
      })
  });

  function incorrectLogin() {
    $('.login-error').remove();
    $('.login').prepend('<span class="login-error">The username or password is incorrect. Please try again.');
  }

  function logoutUser() {
    localStorage.removeItem('authToken');
    $(location).attr('href', BASE_URL);
  }

  $('.link-login').on('click', (event) => {
    hideShow(['.link-login'], ['.link-signup'])
    $('.form-title').html('Login')
  });

  $('.link-signup').on('click', (event) => {
    hideShow(['.link-signup'], ['.link-login'])
    $('.form-title').html('Sign Up')
  });
}


const renderApp = () => {
  hideShow(['.link-signup', '.logo-2'], ['.link-login'])
  createEventListers();
};

$(document).ready(renderApp);
