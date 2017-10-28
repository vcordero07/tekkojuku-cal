let checkWndMatchMedia = () => {
  if (window.matchMedia('(prefers-reduced-motion)').matches) {
    $('#bg-video').removeAttr("autoplay");
    $('#bg-video').trigger('pause');
    $('#pause-btn').html("Paused");
  };
}

let createVideoListers = () => {
  checkWndMatchMedia();

  $('#pause-btn').on('click', (event) => {
    $('#bg-video').toggleClass('stopfade');
    // qonsole.debug("bg-video", $('#bg-video'));
    if ($('#bg-video')["0"].paused) {
      // qonsole.debug("true:", $('#bg-video').paused);
      // qonsole.debug('test true:', ($('#bg-video')["0"].paused));
      $('#bg-video').trigger('play');
      $('#bg-video').attr({ 'autoplay': 'true' });
      $('#pause-btn').html('Pause');
    } else {
      // qonsole.debug("false:", $('#bg-video').paused);
      $('#bg-video').trigger('pause');
      $('#pause-btn').html('Paused');
    }
  });

  $('#bg-video').on('ended', (event) => {
    $('#bg-video').trigger('pause');
    $('#bg-video').addClass('stopfade');
  });
}

const renderVideoApp = () => {
  createVideoListers();
}

$(document).ready(renderVideoApp);
