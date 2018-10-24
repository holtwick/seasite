"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbsoluteURL = isAbsoluteURL;
exports.urlRelative = urlRelative;
exports.translateLinks = translateLinks;
exports.handleLinks = handleLinks;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var url = _interopRequireWildcard(require("url"));

function isAbsoluteURL(url) {
  return url.indexOf('http') === 0;
}

function urlRelative(fromURL, toURL) {
  try {
    var fromParts = fromURL.split('/');
    var toParts = toURL.split('/');
    var indexCommon = 0;

    for (var i = 0; i < fromParts.length - 1; i++) {
      if (toParts[i] === fromParts[i]) {
        indexCommon++;
      } else {
        break;
      }
    }

    fromParts = fromParts.slice(indexCommon);
    toParts = toParts.slice(indexCommon);

    for (var _i = 0; _i < fromParts.length - 1; _i++) {
      toParts.unshift('..');
    }

    return toParts.join('/');
  } catch (err) {
    return toURL;
  }
}

var urlElements = [{
  tag: 'a',
  attr: 'href'
}, {
  tag: 'script',
  attr: 'src'
}, {
  tag: 'link',
  attr: 'href'
}, {
  tag: 'img',
  attr: 'src'
}];

function translateLinks($, baseURL) {
  var _loop = function _loop() {
    var info = urlElements[_i2];
    $("".concat(info.tag, "[").concat(info.attr, "]")).each(function (i, e) {
      e = $(e);
      var href = e.attr(info.attr);

      if (/^(mailto|#|https?:)/.test(href)) {
        return;
      }

      var toUrl = url.resolve('/', href);
      var fromUrl = url.resolve('/', baseURL);
      var newHref = urlRelative(fromUrl, toUrl);
      e.attr(info.attr, newHref);
    });
  };

  for (var _i2 = 0; _i2 < urlElements.length; _i2++) {
    _loop();
  }
}

function handleLinks($, handle) {
  var _loop2 = function _loop2() {
    var info = urlElements[_i3];
    $("".concat(info.tag, "[").concat(info.attr, "]")).each(function (i, e) {
      e = $(e);
      var href = e.attr(info.attr);

      if (/^(mailto|#|https?:)/.test(href)) {
        return;
      }

      var newHref = handle(href);

      if (newHref) {
        e.attr(info.attr, newHref);
      }

      if (info.tag === 'img') {
        var srcset = e.attr('srcset');

        if (srcset) {
          srcset = srcset.split(',').map(function (line) {
            var _line$trim$split = line.trim().split(/[ \t]+/),
                _line$trim$split2 = (0, _slicedToArray2.default)(_line$trim$split, 2),
                href = _line$trim$split2[0],
                scale = _line$trim$split2[1];

            return "".concat(handle(href), " ").concat(scale);
          }).join(', ');
          e.attr('srcset', srcset);
        }
      }
    });
  };

  for (var _i3 = 0; _i3 < urlElements.length; _i3++) {
    _loop2();
  }
}