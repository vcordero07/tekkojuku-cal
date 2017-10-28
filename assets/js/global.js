$(function() {
  qonsole.debug('app.js:80- check');
  if (localStorage.getItem('token')) {
    qonsole.debug('app.js:81-a');
    $(".login-cal-lnk").text('Calendar').attr('href', '/calendar');
    $(".login-inst-lnk").text('Instructors').attr('href', '/instructors');
    $(".login-nb").text('Logout').attr('href', '/logout').addClass('logout-nb');
  } else {
    qonsole.debug('app.js:84-b');
    $(".login-cal-lnk").text('Calendar').attr('href', '/login');
    $(".login-inst-lnk").text('Instructors').attr('href', '/login');
    $(".login-nb").text('Login').attr('href', '/login').removeClass('logout-nb');
  }
});
