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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var info = _step.value;
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

    for (var _iterator = urlElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function handleLinks($, handle) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop2 = function _loop2() {
      var info = _step2.value;
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
                  _line$trim$split2 = (0, _slicedToArray2["default"])(_line$trim$split, 2),
                  href = _line$trim$split2[0],
                  scale = _line$trim$split2[1];

              return "".concat(handle(href), " ").concat(scale);
            }).join(', ');
            e.attr('srcset', srcset);
          }
        }
      });
    };

    for (var _iterator2 = urlElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      _loop2();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}