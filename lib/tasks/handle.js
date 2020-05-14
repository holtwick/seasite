"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = handle;
exports.handleAsync = handleAsync;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _index = require("../index");

var _log = _interopRequireDefault(require("../log"));

var _site = require("../site");

function pathToHTMLPath(path) {
  return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
}

var defaults = {
  pattern: /.*/,
  plugins: []
};

function handle(site) {
  var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var pages = [];
  var plugins = gopt.plugins;
  gopt = Object.assign({}, defaults, gopt);
  site.handle(gopt.pattern, function ($, path) {
    if ((0, _site.isPattern)(gopt.exclude) && (0, _site.pathMatchesPatterns)(path, gopt.exclude)) {
      return false;
    }

    var opt = Object.assign({}, defaults, gopt, {
      site: site,
      path: path
    });

    if ((0, _site.isDOM)($) && plugins && plugins.length) {
      $.applyPlugins(plugins, opt);
    }

    if (!opt.handler) {
      _log["default"].warn('[task.handle] Will not write', path);

      return false;
    }

    if (opt.handler($, path) === false) {
      return false;
    }

    pages.push(opt);
  });
  return pages;
}

function handleAsync(_x) {
  return _handleAsync.apply(this, arguments);
}

function _handleAsync() {
  _handleAsync = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(site) {
    var gopt,
        pages,
        plugins,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            gopt = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            pages = [];
            plugins = gopt.plugins;
            gopt = Object.assign({}, defaults, gopt);
            _context2.next = 6;
            return site.handleAsync(gopt.pattern, function () {
              var _ref = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee($, path) {
                var opt;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!((0, _site.isPattern)(gopt.exclude) && (0, _site.pathMatchesPatterns)(path, gopt.exclude))) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return", false);

                      case 2:
                        opt = Object.assign({}, defaults, gopt, {
                          site: site,
                          path: path
                        });

                        if (!((0, _site.isDOM)($) && plugins && plugins.length)) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 6;
                        return $.applyPluginsAsync(plugins, opt);

                      case 6:
                        if (opt.handler) {
                          _context.next = 9;
                          break;
                        }

                        _log["default"].warn('[task.handle] Will not write', path);

                        return _context.abrupt("return", false);

                      case 9:
                        if (!(opt.handler($, path) === false)) {
                          _context.next = 11;
                          break;
                        }

                        return _context.abrupt("return", false);

                      case 11:
                        pages.push(opt);

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2, _x3) {
                return _ref.apply(this, arguments);
              };
            }());

          case 6:
            return _context2.abrupt("return", pages);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _handleAsync.apply(this, arguments);
}