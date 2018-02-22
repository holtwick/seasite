'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dom = dom;

var _jsx = require('./jsx');

var _plugin = require('./plugins/plugin');

// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
var cheerio = require('cheerio');

function dom(value) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        normalizeWhitespace: true
    };


    if (typeof value === 'string') {
        value = cheerio.load(value, opt);
    }

    if (!(typeof value === 'function' && typeof value.html === 'function')) {
        value = null;
    }

    if (value) {
        var $ = value;

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

                    plugin.work.apply(plugin, [$].concat(opts));
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

        return $;
    }

    return cheerio.load('', opt);
}