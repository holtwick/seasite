"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.img = img;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _fs = require("fs");

var _path = require("path");

var _log = _interopRequireDefault(require("../log"));

var _relativeurls = require("../site/relativeurls");

var sizeOf = require('image-size');

var OPT = {};
var cache = {};

function img() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, OPT, gopt);
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    opt = Object.assign({}, gopt, opt);
    var basePath = opt.basePath || opt.site.basePath;
    var path = opt.path || 'index.html';

    if (basePath) {
      $('img[src]').each(function (i, el) {
        var img = $(el);
        var src = img.attr('src');
        img.attr('loading', 'auto');

        if (src.indexOf('data:') === 0) {
          _log["default"].debug('[plugin.image] Skip data image:', src);

          return;
        }

        var srcset = img.attr('srcset');

        if (srcset) {
          var images = srcset.split(',');
          var result = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var imgsrc = _step.value;

              var _imgsrc$trim$split = imgsrc.trim().split(' '),
                  _imgsrc$trim$split2 = (0, _slicedToArray2["default"])(_imgsrc$trim$split, 2),
                  _src = _imgsrc$trim$split2[0],
                  scale = _imgsrc$trim$split2[1];

              var p = void 0;

              if (_src[0] === '/') {
                _src = _src.substr(1);
                p = (0, _path.join)(basePath, _src);
              } else {
                p = (0, _path.join)(basePath, path, '..', _src);
              }

              if (!(0, _fs.existsSync)(p)) {
                _log["default"].warn("[plugin.image] Image at ".concat(p, " is referenced in ").concat(path, " but is missing!"));

                continue;
              }

              result.push("".concat(_src, " ").concat(scale));
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

          srcset = result.join(', ');
        } else {
          if (!(0, _relativeurls.isAbsoluteURL)(src)) {
            var _p;

            if (src[0] === '/') {
              src = src.substr(1);
              _p = (0, _path.join)(basePath, src);
            } else {
              _p = (0, _path.join)(basePath, path, '..', src);
            }

            if (!(0, _fs.existsSync)(_p)) {
              _log["default"].warn("[plugin.image] Image at ".concat(_p, " is referenced in ").concat(path, " but is missing!"));

              return;
            }

            if (src.indexOf('@2x.') <= 0) {
              var p2 = _p.replace(/\.([a-z0-9]+)$/, '@2x.$1');

              if ((0, _fs.existsSync)(p2)) {
                src = img.attr('src');
                src = src.replace(/\.([a-z0-9]+)$/, '@2x.$1');
                img.attr('src', src);
                _p = p2;
              }
            }

            if (!(img.attr('width') || img.attr('height'))) {
              var size = sizeOf(_p);

              if (src.indexOf('@2x.') > 0) {
                size.width /= 2;
                size.height /= 2;
              }

              img.attr('width', size.width.toString());
              img.attr('height', size.height.toString());
            }
          }
        }

        var parent = img.parent('p');

        if (parent) {
          if (!$(parent).text().trim()) {
            $(parent).addClass('img-wrapper');
          }
        }
      });
    }
  };
}