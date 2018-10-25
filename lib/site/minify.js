"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minifyLESS = minifyLESS;
exports.minifyJS = minifyJS;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _log = _interopRequireDefault(require("../log"));

var UglifyJS = require('uglify-js');

var less = require('less');

var LessPluginCleanCSS = require('less-plugin-clean-css');

function minifyLESS(css) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cleanCSSPlugin = new LessPluginCleanCSS({
    advanced: true
  });
  var options = (0, _objectSpread2.default)({}, opt, {
    sync: true,
    syncImport: true,
    plugins: [cleanCSSPlugin]
  });
  var out = null;
  less.render(css, options, function (err, result) {
    if (err) {
      _log.default.error('LESS minification error: ' + err.toString());

      throw err;
    }

    out = result.css;
  });
  return out;
}

function minifyJS() {
  for (var _len = arguments.length, code = new Array(_len), _key = 0; _key < _len; _key++) {
    code[_key] = arguments[_key];
  }

  var codeString = code.join('\n');
  var result = UglifyJS.minify(codeString);

  if (result == null || result.error) {
    _log.default.error('JS minification error: ' + result.error.toString());

    throw result.error;
  }

  return result.code;
}