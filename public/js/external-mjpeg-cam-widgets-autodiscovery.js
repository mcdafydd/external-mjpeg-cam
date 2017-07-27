/*
  Running this within a function prevents leaking variables
  in to the global namespace.
*/
(function (window) {
  'use strict';
  var widgets = namespace('widgets');
  widgets['orov-external-mjpeg-cam'] = {
    name: 'orov-external-mjpeg-cam',
    defaultUISymantic: 'data-control-unit',
    url: 'external-mjpeg-cam/external-mjpeg-cam.html'
  };
}  // The line below both ends the anonymous function and then calls
   // it passing in the required depenencies.
(window));