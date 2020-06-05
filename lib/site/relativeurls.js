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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  var _iterator = _createForOfIteratorHelper(urlElements),
      _step;

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

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function handleLinks($, handle) {
  var _iterator2 = _createForOfIteratorHelper(urlElements),
      _step2;

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

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop2();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}