$(function() {
  console.log('this is logout attempt');
  localStorage.removeItem('token');
  localStorage.removeItem('uid');
  console.log('should have remove the items');
  $(location).attr('href', '/');
})
