"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
exports.htmlAsync = htmlAsync;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _index = require("../index");

var _handle = require("./handle");

var defaults = {
  pattern: /\.html?$/,
  exclude: null
};

function html(site) {
  var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  gopt = Object.assign({}, defaults, gopt);
  return (0, _handle.handle)(site, gopt);
}

function htmlAsync(_x) {
  return _htmlAsync.apply(this, arguments);
}

function _htmlAsync() {
  _htmlAsync = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(site) {
    var gopt,
        result,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gopt = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            gopt = Object.assign({}, defaults, gopt);
            result = (0, _handle.handle)(site, gopt);

            if (!(result && result.then)) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return result;

          case 6:
            return _context.abrupt("return", _context.sent);

          case 7:
            return _context.abrupt("return", result);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _htmlAsync.apply(this, arguments);
}