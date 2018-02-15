'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.walkSync = walkSync;
exports.rmdir = rmdir;
exports.mkdir = mkdir;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>

function walkSync(rootFolder) {
    var subFolder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var ignoreHidden = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var resultPaths = [];
    var paths = _fs2.default.readdirSync(_path2.default.join(rootFolder, subFolder));
    if (paths != null && paths.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var file = _step.value;

                // if (!ignoreHidden || file[0] !== '.') {
                file = _path2.default.join(subFolder, file);
                var realFile = _path2.default.join(rootFolder, file);
                var stat = _fs2.default.statSync(realFile);
                if (stat && stat.isDirectory()) {
                    resultPaths = resultPaths.concat(walkSync(rootFolder, file) || []);
                } else {
                    resultPaths.push(file);
                }
                // }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return resultPaths;
}

function rmdir(dir) {
    try {
        var list = _fs2.default.readdirSync(dir);
        for (var i = 0; i < list.length; i++) {
            var filename = _path2.default.join(dir, list[i]);
            var stat = _fs2.default.statSync(filename);
            if (filename === '.' || filename === '..') {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {
                // rm filename
                _fs2.default.unlinkSync(filename);
            }
        }
        _fs2.default.rmdirSync(dir);
    } catch (ex) {}
}

function mkdir(p) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var dirs = p.split(_path2.default.sep);
    var dir = dirs.shift();
    root = (root || '') + dir + _path2.default.sep;
    try {
        _fs2.default.mkdirSync(root);
    } catch (ex) {
        //dir wasn't made, something went wrong
        if (!_fs2.default.statSync(root).isDirectory()) {
            throw new Error(ex);
        }
    }
    return !dirs.length || mkdir(dirs.join(_path2.default.sep), root);
}