"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.img = img;

var _path = require("path");

var _fs = require("fs");

var _relativeurls = require("../site/relativeurls");

var _log = _interopRequireDefault(require("../log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        if (src.indexOf('data:') === 0) {
          _log.default.debug('[plugin.image] Skip data image:', src);

          return;
        }

        if (!(0, _relativeurls.isAbsoluteURL)(src)) {
          var p;

          if (src[0] === '/') {
            src = src.substr(1);
            p = (0, _path.join)(basePath, src);
          } else {
            p = (0, _path.join)(basePath, path, '..', src);
          }

          if (!(0, _fs.existsSync)(p)) {
            _log.default.warn("[plugin.image] Image at ".concat(p, " is referenced in ").concat(path, " but is missing!"));

            return;
          }

          if (src.indexOf('@2x.') <= 0) {
            var p2 = p.replace(/\.([a-z0-9]+)$/, '@2x.$1');

            if ((0, _fs.existsSync)(p2)) {
              src = img.attr('src');
              src = src.replace(/\.([a-z0-9]+)$/, '@2x.$1');
              img.attr('src', src);
              p = p2;
            }
          }

          if (!(img.attr('width') || img.attr('height'))) {
            var size = sizeOf(p);

            if (src.indexOf('@2x.') > 0) {
              size.width /= 2;
              size.height /= 2;
            }

            img.attr('width', size.width.toString());
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