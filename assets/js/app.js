let createEventListers = () => {
  console.log('app.js:2 - abcasdfasd');
  $('.tekkojuku_form').submit(function(event) {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('info:', info);
    $.ajax({
        type: "POST",
        url: "/auth/login",
        headers: {
          "Authorization": "Basic " + auth
          // "Content-Type": "application/json"
        },
        data: {
          "username": $('#username').val(),
          "password": $('#password').val(),
          "email": $('#email').val()
        },
        // success: function(responseData, txtStatus, jqXHR) {
        //   alert('data saved');

        // }
        // error: function(jqXHR, txtStatus, err) {
        //   console.log("app.js:24", err);
        // }
        // datatype: "json"
      })
      .done((data) => {
        $.ajax({
          type: "GET",
          url: "/auth/getAuthToken"
        }).done(
          function(responseData) {
            localStorage.setItem("token", responseData.tkn);
            localStorage.setItem("uid", responseData.instructorID);
            console.log('app.js:36 - responseData:', responseData);
          });
      })
  });
}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
