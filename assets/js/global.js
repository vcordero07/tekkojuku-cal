$(function() {
  console.log('app.js:80- check');
  if (localStorage.getItem('token')) {
    console.log('app.js:81-a');
    $(".login-nb").text('Logout').attr('href', '/logout').addClass('logout-nb');
  } else {
    console.log('app.js:84-b');
    $(".login-nb").text('Login').attr('href', '/login').removeClass('logout-nb');
  }
});
