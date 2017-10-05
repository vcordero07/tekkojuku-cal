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
          //"Authorization": "Basic " + auth,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "OAuth oauth_token=ACCESSTOKEN"
          // "Content-Type": "application/json"
        },
        data: {
          "username": $('#username').val(),
          "password": $('#password').val(),
          "email": $('#email').val()
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + auth);
        },
        success: function(data) {
          console.log(data);
        },
        error: function(data, errorThrown) {
          alert("error");
        },
        // success: function(responseData, txtStatus, jqXHR) {
        //   alert('data saved');

        // }
        // error: function(jqXHR, txtStatus, err) {
        //   console.log("app.js:24", err);
        // }
        datatype: "jsonp"
      })
      .done((data) => {
        $.ajax({
          type: "GET",
          url: "/auth/getAuthToken",
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
          },
        }).done(
          function(responseData) {
            accessToken = responseData.tkn;


            localStorage.setItem("token", responseData.tkn);
            localStorage.setItem("uid", responseData.instructorID);
            console.log('app.js:36 - responseData:', responseData);
          });
      })
  });

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
