"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minifyLESSAsync = minifyLESSAsync;
exports.minifyLESS = minifyLESS;
exports.minifyJS = minifyJS;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _site = require("./site");

var _index = _interopRequireDefault(require("../log/index"));

var UglifyJS = require('uglify-js');

var less = require('less');

var LessPluginCleanCSS = require('less-plugin-clean-css');

var defaults = {};

function minifyLESSAsync(_x) {
  return _minifyLESSAsync.apply(this, arguments);
}

function _minifyLESSAsync() {
  _minifyLESSAsync = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(s) {
    var cleanCSSPlugin, r;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cleanCSSPlugin = new LessPluginCleanCSS({
              advanced: true
            });
            _context.next = 3;
            return less.render(s, {
              plugins: [cleanCSSPlugin]
            });

          case 3:
            r = _context.sent;
            return _context.abrupt("return", r.css);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _minifyLESSAsync.apply(this, arguments);
}

if (!less.renderSync) {
  less.renderSync = function (input, options) {
    if (!options || (0, _typeof2.default)(options) != 'object') options = {};
    options.sync = true;
    var css;
    this.render(input, options, function (err, result) {
      if (err) throw err;
      css = result.css;
    });
    return css;
  };
}

function minifyLESS(s) {
  var cleanCSSPlugin = new LessPluginCleanCSS({
    advanced: true
  });
  return less.renderSync(s, {
    plugins: [cleanCSSPlugin]
  });
}

function minifyJS(s) {
  var result = UglifyJS.minify(s);
  return result.code;
}