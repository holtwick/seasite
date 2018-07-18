'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SeaSite = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isPattern = isPattern;
exports.pathMatchesPatterns = pathMatchesPatterns;
exports.filterByPatterns = filterByPatterns;

var _dom = require('./dom');

var _jsx = require('./jsx');

var _fileutil = require('./fileutil');

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Copyright (C) 2018 Dirk Holtwick <https://holtwick.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// @jsx html
var fs = require('fs');
var fsx = require('fs-extra');
var _path = require('path');
// const process = require('process')

// import {absoluteLinks} from './relativeurls'


// This is required to bypass systems umask settings
process.umask(18);

function isPattern(pattern) {
    return pattern != null && (pattern instanceof RegExp || typeof pattern === 'string' || Array.isArray(pattern));
}

function pathMatchesPatterns(path, patterns) {
    if (!Array.isArray(patterns)) {
        patterns = [patterns];
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = patterns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var pattern = _step.value;

            if (typeof pattern === 'string') {

                // Strip leading /
                if (pattern.indexOf('/') === 0) {
                    pattern = pattern.substring(1);
                }

                // Match folder ?
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

    return false;
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

// const LOAD_OPTIONS = {
//     normalizeWhitespace: true,
// }

var SeaSite = exports.SeaSite = function () {
    function SeaSite(srcPath) {
        var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
            excludePatterns: null,
            includePatterns: null,
            baseURL: ''
        };

        _classCallCheck(this, SeaSite);

        _log2.default.setLevel(opt.logLevel || _log2.default.INFO);
        this.log = _log2.default;

        this.opt = opt;
        if (basePath == null) {
            this.basePath = srcPath;
        } else {
            this.basePath = basePath;

            // Filter files
            var files = filterByPatterns((0, _fileutil.walkSync)(srcPath), opt.includePatterns, opt.excludePatterns);

            // Remove old site copy
            (0, _fileutil.rmdir)(basePath);
            (0, _fileutil.mkdir)(basePath);

            // Copy site
            _log2.default.info('Site creation ... ' + srcPath + ' -> ' + basePath);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var file = _step2.value;

                    var src = _path.join(srcPath, file);
                    var dst = _path.join(basePath, file);
                    (0, _fileutil.mkdir)(_path.dirname(dst));
                    fs.copyFileSync(src, dst);

                    // let data = fs.readFileSync(src)

                    // // log.debug(`  cloned ... ${dst}`)
                    // fs.writeFileSync(dst, data, {
                    //     mode: 0o644,
                    // })
                }
                //     // Paths
                //     let pages = [];
                //     for (let filePath of files) {
                //         let page = {
                //             url: '/' + filePath,
                //             outUrl: '/' + filePath,
                //             name: path.basename(filePath).replace(/\.[^\.]+$/, ''),
                //             dirName: path.dirname(filePath),
                //             fileName: path.basename(filePath),
                //             inPath: path.join(project.inPath, filePath),
                //             outPath: path.join(project.outPath, filePath)
                //         };
                //         pages.push(page);
                //     }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }

    // Paths

    _createClass(SeaSite, [{
        key: 'path',
        value: function path(urlPath) {
            return _path.join(this.basePath, urlPath);
        }

        // All URL paths matching pattern

    }, {
        key: 'paths',
        value: function paths(pattern, exclude) {
            var urlPaths = filterByPatterns((0, _fileutil.walkSync)(this.basePath), pattern, exclude);
            urlPaths.sort();
            return urlPaths;
        }
    }, {
        key: 'exists',
        value: function exists(urlPath) {
            try {
                var p = this.path(urlPath);
                return !!fs.statSync(p);
            } catch (err) {}
            return false;
        }

        // URLs

    }, {
        key: 'url',
        value: function url(path) {
            if (path[0] !== '/') {
                path = '/' + path;
            }
            return path;
        }
    }, {
        key: 'publicURL',
        value: function publicURL(path) {
            if (this.opt.publicURL) {
                return this.opt.publicURL(this.url(path));
            }
            return this.opt.baseURL + this.url(path);
        }

        // absoluteURL(path: string): string {
        //     return this.opt.baseURL + this.url(path)
        // }

        // File Actions

    }, {
        key: 'move',
        value: function move(fromPath, toPath) {
            _log2.default.debug('move ... ' + fromPath + ' -> ' + toPath);
            fs.renameSync(this.path(fromPath), this.path(toPath));
        }
    }, {
        key: 'copy',
        value: function copy(fromPath, toPath) {
            _log2.default.debug('copy ... ' + fromPath + ' -> ' + toPath);
            fs.copyFileSync(this.path(fromPath), this.path(toPath));
        }
    }, {
        key: 'copyNPM',
        value: function copyNPM(moduleName) {
            var fromRelativePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var toPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'npm';

            _log2.default.debug('copy npm module ' + moduleName + '/' + fromRelativePath + ' -> ' + toPath);
            var p = require.resolve(moduleName, {
                paths: [process.cwd()]
            });
            _log2.default.assert(!!p, '[site.copyNPM] Could not resolve module ' + moduleName);
            var rx = /^.*\/node_modules\/[^\/]+/gi;
            var m = rx.exec(p);
            _log2.default.assert(!!m, '[site.copyNPM] Could not resolve main path ' + p + ' / ' + this.basePath);
            if (m) {
                p = m[0];
                p = _path.join(p, fromRelativePath);
                _log2.default.assert(fs.existsSync(p), '[site.copyNPM] Path ' + p + ' does not exist');
                var d = this.path(toPath);
                (0, _fileutil.mkdir)(d);
                fsx.copySync(p, d);
            }
        }
    }, {
        key: 'remove',
        value: function remove(pattern) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.paths(pattern)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var p = _step3.value;

                    _log2.default.debug('remove ... ' + p);
                    fs.unlinkSync(this.path(p));
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        // Read / Write

    }, {
        key: 'read',
        value: function read(urlPath) {
            try {
                if (urlPath[0] === '/') {
                    urlPath = urlPath.substring(1);
                }
                var inPath = _path.join(this.basePath, urlPath);
                return fs.readFileSync(inPath);
            } catch (ex) {
                _log2.default.error('Failed to .read file:', urlPath);
            }
            return null;
        }
    }, {
        key: 'write',
        value: function write(urlPath, content) {
            if (urlPath[0] === '/') {
                urlPath = urlPath.substring(1);
            }
            var outPath = _path.join(this.basePath, urlPath);
            (0, _fileutil.mkdir)(_path.dirname(outPath));
            _log2.default.debug('write ... ' + outPath);

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

        // DEPRECATED:2018-02-23

    }, {
        key: 'writeDOM',
        value: function writeDOM($, urlPath) {
            var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var content = void 0;
            if (mode === 'xml') {
                content = (0, _jsx.prependXMLIdentifier)($.xml());
                // HACK:dholtwick:2016-08-23 Workaround cheerio bug
                content = content.replace(/<!--\[CDATA\[>([\s\S]*?)]]-->/g, '<![CDATA[$1]]>');
            } else {
                // absoluteLinks($, '/' + urlPath)
                content = $.html();
            }

            // Strip comments
            // TODO:2018-02-23 migrate!
            content = content.replace(/<!--(.*?)-->/g, '');

            // log.debug($.html());
            this.write(urlPath, content);
        }
    }, {
        key: 'handle',
        value: function handle(pattern, handler) {
            var urlPaths = this.paths(pattern);
            if (!urlPaths || urlPaths.length <= 0) {
                _log2.default.warn('Did not match any file for', pattern);
            }
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = urlPaths[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var urlPath = _step4.value;

                    _log2.default.debug('handle ... ' + urlPath);
                    var content = this.read(urlPath) || '';

                    var result = {
                        path: urlPath,
                        mode: null,
                        content: null,
                        ignore: false
                    };

                    var ret = null;
                    if (/\.(html?|xml)$/i.test(urlPath)) {
                        var xmlMode = /\.xml$/i.test(urlPath);
                        var $ = (0, _dom.dom)(content, { xmlMode: xmlMode });
                        result.mode = xmlMode ? 'xml' : 'html';
                        result.content = $;
                        ret = handler($, urlPath);
                    } else {
                        result.content = content;
                        ret = handler(content, urlPath);
                    }

                    if (ret !== false) {
                        if (typeof ret === 'string') {
                            ret = { content: ret };
                        }
                        ret = ret || result || {};
                        if (ret.ignore !== true) {
                            var p = ret.path || urlPath;
                            var _content = ret.content || result.content;
                            if ((0, _dom.isDOM)(_content)) {
                                var mode = ret.mode || result.mode;
                                if (mode === 'html') {
                                    this.writeDOM(_content, p, mode);
                                }
                            } else if (_content) {
                                this.write(p, _content);
                            } else {
                                _log2.default.error('Unknow content type for', p, '=>', _content);
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }]);

    return SeaSite;
}();

process.on('unhandledRejection', function (reason, p) {
    _log2.default.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

process.on('handledRejection', function (reason, p) {
    _log2.default.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});