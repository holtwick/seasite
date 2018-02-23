'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SeaSite = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = require('./dom');

var _jsx = require('./jsx');

var _relativeurls = require('./relativeurls');

var _fileutil = require('./fileutil');

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

// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
var fs = require('fs');
var _path = require('path');
var process = require('process');

var LOAD_OPTIONS = {
    normalizeWhitespace: true
};

var SeaSite = exports.SeaSite = function () {
    function SeaSite(srcPath) {
        var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
            excludePatterns: [],
            includePatterns: [],
            baseURL: ''
        };

        _classCallCheck(this, SeaSite);

        this.opt = opt;
        if (basePath == null) {
            this.basePath = srcPath;
        } else {
            this.basePath = basePath;

            // Filter files
            var files = (0, _fileutil.walkSync)(srcPath);
            files = files.filter(function (file) {
                return opt.includePatterns.some(function (pattern) {
                    pattern.lastIndex = 0;
                    return pattern.test(file);
                }) && !opt.excludePatterns.some(function (pattern) {
                    pattern.lastIndex = 0;
                    // this.log(path, pattern.test(path));
                    return pattern.test(file);
                });
            });

            // Remove old site copy
            (0, _fileutil.rmdir)(basePath);
            (0, _fileutil.mkdir)(basePath);

            // Copy site
            this.log('cloning ... ' + srcPath + ' -> ' + basePath);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var file = _step.value;

                    var src = _path.join(srcPath, file);
                    var dst = _path.join(basePath, file);
                    var data = fs.readFileSync(src);
                    (0, _fileutil.mkdir)(_path.dirname(dst));
                    // this.log(`  cloned ... ${dst}`)
                    fs.writeFileSync(dst, data);
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
    }

    _createClass(SeaSite, [{
        key: 'log',
        value: function log() {
            var _console;

            (_console = console).log.apply(_console, arguments);
        }

        // Path and URL

    }, {
        key: 'path',
        value: function path(urlPath) {
            return _path.join(this.basePath, urlPath);
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
    }, {
        key: 'url',
        value: function url(path) {
            if (path[0] !== '/') {
                path = '/' + path;
            }
            return path;
        }
    }, {
        key: 'absoluteURL',
        value: function absoluteURL(path) {
            return this.opt.baseURL + this.url(path);
        }

        // File Actions

    }, {
        key: 'move',
        value: function move(fromPath, toPath) {
            this.log('move ... ' + fromPath + ' -> ' + toPath);
            fs.renameSync(this.path(fromPath), this.path(toPath));
        }
    }, {
        key: 'copy',
        value: function copy(fromPath, toPath) {
            this.log('copy ... ' + fromPath + ' -> ' + toPath);
            fs.copyFileSync(this.path(fromPath), this.path(toPath));
        }
    }, {
        key: 'remove',
        value: function remove(pattern) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.paths(pattern)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var p = _step2.value;

                    this.log('remove ... ' + p);
                    fs.unlinkSync(this.path(p));
                }
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
                console.error('Failed to .read file:', urlPath);
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
            this.log('write ... ' + outPath);

            if (typeof content !== 'string') {
                if ((0, _dom.isDOM)(content)) {
                    content = content.html();
                } else {
                    content = content.toString();
                }
            }
            fs.writeFileSync(outPath, content);
        }

        // All URL paths matching pattern

    }, {
        key: 'paths',
        value: function paths(pattern) {
            var urlPaths = [];
            if (typeof pattern === 'string') {
                urlPaths = [pattern];
            } else if (pattern instanceof RegExp) {
                urlPaths = (0, _fileutil.walkSync)(this.basePath).filter(function (file) {
                    pattern.lastIndex = 0;
                    return pattern.test(file);
                });
            } else if (Array.isArray(pattern)) {
                urlPaths = pattern;
            }
            urlPaths.sort();
            return urlPaths;
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
                (0, _relativeurls.absoluteLinks)($, '/' + urlPath);
                content = $.html();
            }

            // Strip comments
            content = content.replace(/<!--(.*?)-->/g, '');

            // this.log($.html());
            this.write(urlPath, content);
        }
    }, {
        key: 'handle',
        value: function handle(pattern, handler) {
            var urlPaths = this.paths(pattern);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = urlPaths[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var urlPath = _step3.value;

                    // this.log(`handle ... ${urlPath}`)
                    var content = this.read(urlPath) || '';
                    if (/\.(html?|xml)$/i.test(urlPath)) {
                        var xmlMode = /\.xml$/i.test(urlPath);
                        // let normalizeWhitespace = false
                        var $ = (0, _dom.dom)(content, { xmlMode: xmlMode });
                        var ret = handler($, urlPath);
                        if (ret !== false) {
                            if (typeof ret === 'string' && ret !== 'xml') {
                                this.write(urlPath, ret);
                            } else {
                                this.writeDOM($, urlPath, ret);
                            }
                        }
                    } else {
                        var _ret = handler(content, urlPath);
                        if (_ret !== false && _ret != null) {
                            this.write(urlPath, _ret);
                        }
                    }
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
    }]);

    return SeaSite;
}();

process.on('unhandledRejection', function (reason, p) {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

process.on('handledRejection', function (reason, p) {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});