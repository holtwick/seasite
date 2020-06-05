"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPattern = isPattern;
exports.pathMatchesPatterns = pathMatchesPatterns;
exports.filterByPatterns = filterByPatterns;
exports.SeaSite = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _log = _interopRequireDefault(require("../log"));

var _dom = require("./dom");

var _fileutil = require("./fileutil");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var fs = require('fs');

var fsx = require('fs-extra');

var _path = require('path');

process.umask(18);

function isPattern(pattern) {
  return pattern != null && (pattern instanceof RegExp || typeof pattern === 'string' || Array.isArray(pattern));
}

function pathMatchesPatterns(path, patterns) {
  var result = function () {
    if (!Array.isArray(patterns)) {
      patterns = [patterns];
    }

    var _iterator = _createForOfIteratorHelper(patterns),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var pattern = _step.value;

        if (typeof pattern === 'string') {
          if (pattern.indexOf('/') === 0) {
            pattern = pattern.substring(1);
          }

          if (pattern[pattern.length - 1] === '/') {
            if (path.indexOf(pattern) === 0) {
              return true;
            }
          } else if (path === pattern) {
            return true;
          }
        } else if (pattern instanceof RegExp) {
          pattern.lastIndex = 0;

          if (pattern.test(path)) {
            return true;
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return false;
  }();

  return result;
}

function filterByPatterns(paths, patterns, exclude) {
  return (paths || []).filter(function (file) {
    if (pathMatchesPatterns(file, patterns || [])) {
      if (isPattern(exclude)) {
        return !pathMatchesPatterns(file, exclude || []);
      }

      return true;
    }

    return false;
  });
}

var SeaSite = function () {
  function SeaSite(srcPath) {
    var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      excludePatterns: null,
      includePatterns: null,
      baseURL: ''
    };
    (0, _classCallCheck2["default"])(this, SeaSite);
    (0, _defineProperty2["default"])(this, "opt", void 0);
    (0, _defineProperty2["default"])(this, "basePath", void 0);
    (0, _defineProperty2["default"])(this, "log", void 0);

    _log["default"].setLevel(opt.logLevel || _log["default"].INFO);

    this.log = _log["default"];
    this.opt = opt;

    if (basePath == null) {
      this.basePath = srcPath;
    } else {
      this.basePath = basePath;
      var files = filterByPatterns((0, _fileutil.walkSync)(srcPath), opt.includePatterns, opt.excludePatterns);
      (0, _fileutil.rmdir)(basePath);
      (0, _fileutil.mkdir)(basePath);

      _log["default"].info("Site creation ... ".concat(srcPath, " -> ").concat(basePath));

      var _iterator2 = _createForOfIteratorHelper(files),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var file = _step2.value;

          var src = _path.join(srcPath, file);

          var dst = _path.join(basePath, file);

          (0, _fileutil.mkdir)(_path.dirname(dst));
          fs.copyFileSync(src, dst);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }

  (0, _createClass2["default"])(SeaSite, [{
    key: "path",
    value: function path(urlPath) {
      return _path.join(this.basePath, urlPath);
    }
  }, {
    key: "paths",
    value: function paths(pattern, exclude) {
      var urlPaths = filterByPatterns((0, _fileutil.walkSync)(this.basePath), pattern, exclude);
      urlPaths.sort();
      return urlPaths;
    }
  }, {
    key: "exists",
    value: function exists(urlPath) {
      try {
        var p = this.path(urlPath);
        return !!fs.statSync(p);
      } catch (err) {}

      return false;
    }
  }, {
    key: "url",
    value: function url(path) {
      if (path[0] !== '/') {
        path = '/' + path;
      }

      return path;
    }
  }, {
    key: "publicURL",
    value: function publicURL(path) {
      if (this.opt.publicURL) {
        return this.opt.publicURL(this.url(path));
      }

      return this.opt.baseURL + this.url(path);
    }
  }, {
    key: "move",
    value: function move(fromPath, toPath) {
      _log["default"].debug("move ... ".concat(fromPath, " -> ").concat(toPath));

      fs.renameSync(this.path(fromPath), this.path(toPath));
    }
  }, {
    key: "copy",
    value: function copy(fromPath, toPath) {
      _log["default"].debug("copy ... ".concat(fromPath, " -> ").concat(toPath));

      fs.copyFileSync(this.path(fromPath), this.path(toPath));
    }
  }, {
    key: "copyNPM",
    value: function copyNPM(moduleName) {
      var fromRelativePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var toPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'npm';

      _log["default"].debug("copy npm module ".concat(moduleName, "/").concat(fromRelativePath, " -> ").concat(toPath));

      var p = require.resolve(moduleName, {
        paths: [process.cwd()]
      });

      _log["default"].assert(!!p, "[site.copyNPM] Could not resolve module ".concat(moduleName));

      var rx = /^.*\/node_modules\/[^\/]+/gi;
      var m = rx.exec(p);

      _log["default"].assert(!!m, "[site.copyNPM] Could not resolve main path ".concat(p, " / ").concat(this.basePath));

      if (m) {
        p = m[0];
        p = _path.join(p, fromRelativePath);

        _log["default"].assert(fs.existsSync(p), "[site.copyNPM] Path ".concat(p, " does not exist"));

        var d = this.path(toPath);
        (0, _fileutil.mkdir)(d);
        fsx.copySync(p, d);
      }
    }
  }, {
    key: "remove",
    value: function remove(pattern) {
      var _iterator3 = _createForOfIteratorHelper(this.paths(pattern)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var p = _step3.value;

          _log["default"].debug("remove ... ".concat(p));

          fs.unlinkSync(this.path(p));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "read",
    value: function read(urlPath) {
      try {
        if (urlPath[0] === '/') {
          urlPath = urlPath.substring(1);
        }

        var inPath = _path.join(this.basePath, urlPath);

        return fs.readFileSync(inPath);
      } catch (ex) {
        _log["default"].error('Failed to .read file:', urlPath);
      }

      return null;
    }
  }, {
    key: "write",
    value: function write(urlPath, content) {
      if (urlPath[0] === '/') {
        urlPath = urlPath.substring(1);
      }

      var outPath = _path.join(this.basePath, urlPath);

      (0, _fileutil.mkdir)(_path.dirname(outPath));

      _log["default"].debug("write ... ".concat(outPath));

      if (typeof content !== 'string') {
        if ((0, _dom.isDOM)(content)) {
          content = content.html();
        } else {
          content = content.toString();
        }
      }

      fs.writeFileSync(outPath, content, {
        mode: 420
      });
    }
  }, {
    key: "writeDOM",
    value: function writeDOM($, urlPath, opt) {
      var markup;

      try {
        markup = $.markup(opt);
      } catch (e) {
        _log["default"].error('Problem writing to', urlPath, 'with', $);

        throw e;
      }

      this.write(urlPath, markup);
    }
  }, {
    key: "handle",
    value: function () {
      var _handle = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(pattern, handler) {
        var urlPaths, _iterator4, _step4, urlPath, content, result, ret, xmlMode, $, p, _content;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                urlPaths = this.paths(pattern);

                if (!urlPaths || urlPaths.length <= 0) {
                  _log["default"].warn('Did not match any file for', pattern);
                }

                _iterator4 = _createForOfIteratorHelper(urlPaths);
                _context.prev = 3;

                _iterator4.s();

              case 5:
                if ((_step4 = _iterator4.n()).done) {
                  _context.next = 20;
                  break;
                }

                urlPath = _step4.value;

                _log["default"].debug("handle ... ".concat(urlPath));

                content = '';

                if (this.exists(urlPath)) {
                  content = this.read(urlPath);
                }

                result = {
                  path: urlPath,
                  mode: null,
                  content: null,
                  ignore: false
                };
                ret = null;

                if (/\.(html?|xml)$/i.test(urlPath)) {
                  xmlMode = /\.xml$/i.test(urlPath);
                  $ = (0, _dom.dom)(content, {
                    xmlMode: xmlMode
                  });
                  result.content = $;
                  ret = handler($, urlPath);
                } else {
                  result.content = content;
                  ret = handler(content, urlPath);
                }

                if (!(ret && ret.then)) {
                  _context.next = 17;
                  break;
                }

                _context.next = 16;
                return ret;

              case 16:
                ret = _context.sent;

              case 17:
                if (ret !== false) {
                  if (typeof ret === 'string') {
                    ret = {
                      content: ret
                    };
                  }

                  ret = ret || result || {};

                  if (ret.ignore !== true) {
                    p = ret.path || urlPath;
                    _content = ret.content || result.content;

                    if ((0, _dom.isDOM)(_content)) {
                      this.writeDOM(_content, p);
                    } else if (_content) {
                      this.write(p, _content);
                    } else {
                      _log["default"].error('Unknown content type for', p, '=>', _content);
                    }
                  }
                }

              case 18:
                _context.next = 5;
                break;

              case 20:
                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context["catch"](3);

                _iterator4.e(_context.t0);

              case 25:
                _context.prev = 25;

                _iterator4.f();

                return _context.finish(25);

              case 28:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 22, 25, 28]]);
      }));

      function handle(_x, _x2) {
        return _handle.apply(this, arguments);
      }

      return handle;
    }()
  }]);
  return SeaSite;
}();

exports.SeaSite = SeaSite;
process.on('unhandledRejection', function (reason, p) {
  _log["default"].warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
process.on('handledRejection', function (reason, p) {
  _log["default"].warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});