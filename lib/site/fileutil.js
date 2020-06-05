"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walkSync = walkSync;
exports.rmdir = rmdir;
exports.mkdir = mkdir;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function walkSync(rootFolder) {
  var subFolder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var ignoreHidden = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var resultPaths = [];

  var paths = _fs["default"].readdirSync(_path["default"].join(rootFolder, subFolder));

  if (paths != null && paths.length > 0) {
    var _iterator = _createForOfIteratorHelper(paths),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var file = _step.value;
        file = _path["default"].join(subFolder, file);

        var realFile = _path["default"].join(rootFolder, file);

        var stat = _fs["default"].statSync(realFile);

        if (stat && stat.isDirectory()) {
          resultPaths = resultPaths.concat(walkSync(rootFolder, file) || []);
        } else {
          resultPaths.push(file);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return resultPaths;
}

function rmdir(dir) {
  try {
    var list = _fs["default"].readdirSync(dir);

    for (var i = 0; i < list.length; i++) {
      var filename = _path["default"].join(dir, list[i]);

      var stat = _fs["default"].statSync(filename);

      if (filename === '.' || filename === '..') {} else if (stat.isDirectory()) {
        rmdir(filename);
      } else {
        _fs["default"].unlinkSync(filename);
      }
    }

    _fs["default"].rmdirSync(dir);
  } catch (ex) {}
}

function mkdir(p) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var dirs = p.split(_path["default"].sep);
  var dir = dirs.shift();
  root = (root || '') + dir + _path["default"].sep;

  try {
    _fs["default"].mkdirSync(root, 493);
  } catch (ex) {
    if (!_fs["default"].statSync(root).isDirectory()) {
      throw new Error(ex);
    }
  }

  return !dirs.length || mkdir(dirs.join(_path["default"].sep), root);
}