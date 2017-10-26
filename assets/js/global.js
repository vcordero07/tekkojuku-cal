$(function() {
  console.log('app.js:80- check');
  if (localStorage.getItem('token')) {
    console.log('app.js:81-a');
    $(".login-cal-lnk").text('Calendar').attr('href', '/calendar');
    $(".login-inst-lnk").text('Instructors').attr('href', '/instructors');
    $(".login-nb").text('Logout').attr('href', '/logout').addClass('logout-nb');
  } else {
    console.log('app.js:84-b');
    $(".login-cal-lnk").text('Calendar').attr('href', '/login');
    $(".login-inst-lnk").text('Instructors').attr('href', '/login');
    $(".login-nb").text('Login').attr('href', '/login').removeClass('logout-nb');
  }
});
