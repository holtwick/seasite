"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _minify = require("./minify");

describe('Minify', function () {
  it('should do LESS Async', (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
    var r;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _minify.minifyLESSAsync)('body { color: red } ');

          case 2:
            r = _context.sent;
            expect(r).toEqual('body{color:red}');

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  it('should do LESS', function () {
    var r = (0, _minify.minifyLESS)('body { color: red } ');
    expect(r).toEqual('body{color:red}');
  });
  it('should do JS', function () {
    var r = (0, _minify.minifyJS)('var aa = 1+2;');
    expect(r).toEqual('var aa=3;');
  });
});