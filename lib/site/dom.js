'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDOM = isDOM;
exports.toString = toString;
exports.dom = dom;
exports.xml = xml;
exports.html = html;

var _jsx = require('./jsx');

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var cheerio = require('cheerio');

function isDOM(obj) {
    return obj && typeof obj === 'function' && typeof obj.html === 'function';
}

function toString(obj) {
    if (obj) {
        if (obj instanceof Buffer) {
            return toString('utf8');
        } else if (isDOM(obj)) {
            return obj.html();
        }
    }
    return (obj || '').toString();
}

function dom(value) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        normalizeWhitespace: true
    };


    var xmlMode = opt.xmlMode === true;

    if (value instanceof Buffer) {
        value = value.toString('utf8');
    }

    if (!isDOM(value)) {
        if (typeof value !== 'string') {
            value = '';
        } else if (!xmlMode) {
            // Fix non closing tags
            value = value.replace(/<\/(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)>/gi, '');
        }
        value = cheerio.load(value, opt);
    }

    // FLOW:2018-02-23
    var $ = value;

    $.xmlMode = xmlMode;

    $.applyPlugins = function (plugins) {
        for (var _len = arguments.length, opts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            opts[_key - 1] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var plugin = _step.value;

                plugin.apply(undefined, [$].concat(opts));
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
    };

    $.decorate = function (selector, fn) {
        $(selector).each(function (i, e) {
            e = $(e);
            e.replaceWith(fn((0, _jsx.HTML)(e.html())));
        });
    };

    $.reload = function (html) {
        // log.warn('Reload HTML', html)
        $.root().empty().html($.load(html).root());
    };

    function postProcessMarkup(markup) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            stripComments: true,
            stripPHP: false
        };

        if (opt) {
            if (!opt.stripPHP) {
                markup = markup.replace(/&lt;\?(php)?([\s\S]*?)\??&gt;/g, function (m, p1, p2) {
                    return '<?php' + (0, _jsx.unescapeHTML)(p2) + '?>';
                });
                markup = markup.replace(/%3C\?(php)?([\s\S]*?)\?%3E/g, function (m, p1, p2) {
                    return '<?php' + decodeURIComponent(p2) + '?>';
                });
                markup = markup.replace(/<!--\?(php)?([\s\S]*?)\?-->/g, '<?php$2?>');
            }

            if (opt.stripComments) {
                markup = markup.replace(/<!--([\s\S]*?)-->/g, '');
            }
        }
        return markup;
    }

    $.markup = function (opt) {
        var markup = void 0;
        if ($.xmlMode) {
            markup = '<?xml version="1.0" encoding="utf-8"?>\n' + $.xml();
        } else {
            markup = $.html();
            if (markup.trim().toLowerCase().indexOf('<!doctype ') !== 0) {
                markup = '<!doctype html>\n' + markup;
            }
        }
        return postProcessMarkup(markup, opt);
    };

    $.bodyMarkup = function (opt) {
        var markup = $.xmlMode ? $.xml() : $('body').html();
        return postProcessMarkup(markup, opt);
    };

    // Fix for cheerio bug
    // let xmlFn = $.xml
    // $.xml = function () {
    //     let content = xmlFn.call($)
    //     content = content.replace(/<\!--\[CDATA\[([\s\S]*?)\]\]-->/g, '<![CDATA[$1]]>')
    //     return content
    // }

    return $;
}

function xml(value) {
    return dom(value || '', { xmlMode: true });
}

function html(value) {
    return dom(value || '');
}