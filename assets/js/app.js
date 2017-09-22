let createEventListers = () => {
  console.log('abcasdfasd');
  $('.tekkojuku_form').submit((event) => {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('info:', info);
    $.ajax({
      type: "POST",
      url: "/auth/login",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json"
      },
      data: {
        "username": $('#username').val(),
        "password": $('#password').val(),
        "email": $('#email').val()
      },
      // success: function(responseData, txtStatus, jqXHR) {
      //   alert('data saved');
      // },
      // error: function(jqXHR, txtStatus, err) {
      //   console.log(err);
      // }
      // datatype: "json"
    })
  });
}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
