"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripComments = stripComments;
exports.minifyLESS = minifyLESS;
exports.minifyJS = minifyJS;
exports.purgeCSS = purgeCSS;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _log = _interopRequireDefault(require("../log"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var UglifyJS = require('uglify-js');

var less = require('less');

var LessPluginCleanCSS = require('less-plugin-clean-css');

var _require = require('purgecss'),
    PurgeCSS = _require.PurgeCSS;

function stripComments(code) {
  if (!code) return null;
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}

function minifyLESS(css) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cleanCSSPlugin = new LessPluginCleanCSS({
    advanced: true
  });

  var options = _objectSpread(_objectSpread({}, opt), {}, {
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

function purgeCSS(_x, _x2) {
  return _purgeCSS.apply(this, arguments);
}

function _purgeCSS() {
  _purgeCSS = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(html, css) {
    var opt,
        result,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opt = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.next = 3;
            return new PurgeCSS().purge({
              content: [{
                raw: html
              }],
              css: [{
                raw: css
              }]
            });

          case 3:
            result = _context.sent;
            _context.prev = 4;
            return _context.abrupt("return", result.map(function (r) {
              return r.css || '';
            }).join('\n'));

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](4);

            _log["default"].error('Exception:', _context.t0);

          case 11:
            return _context.abrupt("return", '');

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 8]]);
  }));
  return _purgeCSS.apply(this, arguments);
}