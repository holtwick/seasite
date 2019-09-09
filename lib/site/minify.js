"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripComments = stripComments;
exports.minifyLESS = minifyLESS;
exports.minifyJS = minifyJS;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _log = _interopRequireDefault(require("../log"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var UglifyJS = require('uglify-js');

var less = require('less');

var LessPluginCleanCSS = require('less-plugin-clean-css');

function stripComments(code) {
  if (!code) return null;
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}

function minifyLESS(css) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cleanCSSPlugin = new LessPluginCleanCSS({
    advanced: true
  });

  var options = _objectSpread({}, opt, {
    sync: true,
    syncImport: true,
    plugins: [cleanCSSPlugin]
  });

  var out = null;
  less.render(css, options, function (err, result) {
    if (err) {
      _log["default"].error('LESS minification error: ' + err.toString());

      throw err;
    }

    out = result.css;
  });
  return stripComments(out);
}

function minifyJS() {
  for (var _len = arguments.length, code = new Array(_len), _key = 0; _key < _len; _key++) {
    code[_key] = arguments[_key];
  }

  var codeString = code.join('\n');
  var result = UglifyJS.minify(codeString);

  if (result == null || result.error) {
    _log["default"].error('JS minification error: ' + result.error.toString());

    throw result.error;
  }

  return stripComments(result.code);
}