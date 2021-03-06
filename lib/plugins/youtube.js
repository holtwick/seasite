"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.youtube = youtube;

var _jsx = require("../site/jsx");

var OPT = {
  videoTitle: 'Play video'
};

function youtube() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, OPT, gopt);
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    opt = Object.assign({}, gopt, opt);
    var basePath = opt.basePath || opt.site.basePath;
    var path = opt.path || 'index.html';

    if (basePath) {
      $('iframe[src]').each(function (i, el) {
        var iframe = $(el);
        var src = iframe.attr('src');
        var m = /^https:\/\/www.youtube(?:-nocookie)?.com\/embed\/(.*?)$/.exec(src);

        if (m && m.length) {
          var key = m[1];

          if (key && key.length) {
            var root = iframe;
            var div = iframe.parent('div.embed-video-container,div.embed-responsive');

            if (div.html()) {
              root = div;
            }

            var staticLink = "https://youtu.be/".concat(key);
            var onClick = "this.parentNode.innerHTML = '<iframe src=\"https://www.youtube.com/embed/".concat(key, "?autoplay=1\" frameBorder=\"0\" allowFullScreen class=\"embed-responsive-item\"></iframe>'; return false;");
            var thumbnailURL = "https://i.ytimg.com/vi/".concat(key, "/0.jpg");
            root.replaceWith((0, _jsx.jsx)("div", {
              className: "video-wrapper embed-video-container embed-responsive embed-responsive-16by9"
            }, (0, _jsx.jsx)("a", {
              href: staticLink,
              onClick: onClick,
              style: "background-image:url(\"".concat(thumbnailURL, "\");"),
              title: opt.videoTitle
            }, "\xA0"), (0, _jsx.jsx)("div", {
              className: "video-overlay-content"
            }, (0, _jsx.jsx)("div", {
              className: "video-overlay-inner"
            }, (0, _jsx.jsx)("svg", {
              className: "video-overlay-play-button",
              viewBox: "0 0 200 200"
            }, (0, _jsx.jsx)("circle", {
              cx: "100",
              cy: "100",
              r: "90",
              fill: "none",
              "stroke-width": "15",
              stroke: "#fff"
            }), (0, _jsx.jsx)("polygon", {
              points: "70, 55 70, 145 145, 100",
              fill: "#fff"
            })), (0, _jsx.jsx)("div", null, opt.videoTitle)))));
          }
        }
      });
    }
  };
}