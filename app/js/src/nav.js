$( document ).ready(function() {
  $('.nav-trigger').click(function(e) {
    $('.hamburger').toggleClass('close');
    $('html,body').toggleClass('lock');
    $('.nav-trigger').toggleClass('none-color');
    $('.fader').fadeToggle(200);
  });
});