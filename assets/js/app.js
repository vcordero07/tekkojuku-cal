let createEventListers = () => {
  console.log('abcasdfasd');
  $('.tekkojuku_form').submit((event) => {
    event.preventDefault();
    let auth = btoa($('#username').val() + ':' + $('#password').val());
    //console.log('info:', info);
    $.ajax({
      type: "POST",
      url: '/auth/login',
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json"
      },
      data: {
        username: $('#username').val(),
        password: $('#password').val(),
        email: $('#email').val()
      }
    })
  });
}


const renderApp = () => {
  createEventListers();
};

$(document).ready(renderApp);
