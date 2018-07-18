'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.localize = localize;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPT = {}; /*
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

// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

function localize() {
    var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    gopt = Object.assign({}, OPT, gopt);

    return function ($) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        opt = Object.assign({}, gopt, opt);

        var lang = opt.lang.toLowerCase();
        _log2.default.assert(!!lang, '[plugin.localize] opt.lang required');

        if (lang) {
            var stringsPath = _path2.default.join(process.cwd(), 'languages', lang + '.json');

            var strings = void 0;
            try {
                strings = opt.strings || JSON.parse(_fs2.default.readFileSync(stringsPath, { encoding: 'utf8' })) || {};
            } catch (e) {
                _log2.default.warn('[plugin.localize] Error loading strings for', lang, '=>', e.toString());
                strings = {};
            }

            var html = $.html();

            var fn = function fn(m, p, f, s) {
                if (s && f !== '_blank') {
                    var sr = strings[s] || strings[s.trim()];
                    if (!sr && opt.missing) {
                        opt.missing[s.trim()] = s.trim();
                    }
                    return p + (sr || s);
                }
            };

            html = html.replace(/(>\s*)(__?([^<]+))/gm, fn);
            html = html.replace(/(")(__?([^"]+))/gm, fn);
            html = html.replace(/(&apos;)(__?([^&]+))/gm, fn); // quoted when inside an attribute like onclick="setLang('_lang')"

            $.reload(html);

            // On element level
            $('*[data-lang]:not([data-lang=' + lang + '])').remove();
        }
    };
}