'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
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

// Special cases:
// 1. <noop> is an element that is not printed out, can be used to create a list of elements
// 2. Attribute name '__' gets transformed to ':' for namespace emulation
// 3. Emulate CDATA by <cdata> element

exports.escapeHTML = escapeHTML;
exports.unescapeHTML = unescapeHTML;
exports.CDATA = CDATA;
exports.HTML = HTML;
exports.prependXMLIdentifier = prependXMLIdentifier;
exports.jsx = jsx;

var _dom = require('./dom');

function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

function unescapeHTML(s) {
    return s.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&apos;/gi, '\'').replace(/&amp;/gi, '&');
}

var USED_JSX = []; // HACK:dholtwick:2016-08-23
// var __xmlMode = false // HACK:2017-12-29

function CDATA(s) {
    s = '<![CDATA[' + s + ']]>';
    USED_JSX.push(s);
    return s;
}

function HTML(s) {
    USED_JSX.push(s);
    return s;
}

function prependXMLIdentifier(s) {
    return '<?xml version="1.0" encoding="utf-8"?>\n' + s;
}

function jsx(tag, attrs) {
    var s = '';
    tag = tag.replace(/__/g, ':');
    if (tag !== 'noop') {
        if (tag !== 'cdata') {
            s += '<' + tag;
        } else {
            s += '<![CDATA[';
        }

        // Add attributes
        for (var name in attrs) {
            if (name && attrs.hasOwnProperty(name)) {
                (function () {
                    var v = attrs[name];
                    if (name.toLowerCase() === 'classname') {
                        name = 'class';
                    }
                    name = name.replace(/__/g, ':');
                    if (v === true) {
                        s += ' ' + name + '="' + name + '"';
                    } else if (name === 'style' && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
                        s += ' ' + name + '="' + Object.keys(v).filter(function (k) {
                            return v[k] != null;
                        }).map(function (k) {
                            var vv = v[k];
                            vv = typeof vv === 'number' ? vv + 'px' : vv;
                            return k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + ':' + vv;
                        }).join(';') + '"';
                    } else if (v !== false && v != null) {
                        s += ' ' + name + '="' + escapeHTML(v.toString()) + '"';
                    }
                })();
            }
        }
        if (tag !== 'cdata') {
            s += '>';
        }

        // if (!__xmlMode) {
        //     if (['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'].indexOf(tag) !== -1) {
        //         USED_JSX.push(s)
        //         return s
        //     }
        // }
    }

    // Append children

    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            if (child != null && child !== false) {
                if (!Array.isArray(child)) {
                    child = [child];
                }
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = child[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var c = _step2.value;

                        if (USED_JSX.indexOf(c) !== -1) {
                            s += c;
                        } else {
                            if ((0, _dom.isDOM)(c)) {
                                s += c.bodyMarkup();
                            } else {
                                s += escapeHTML(c.toString());
                            }
                        }
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

    if (tag !== 'noop') {
        if (tag !== 'cdata') {
            s += '</' + tag + '>';
        } else {
            s += ']]>';
        }
    }
    USED_JSX.push(s);
    return s;
}