"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbsoluteURL = isAbsoluteURL;
exports.urlRelative = urlRelative;
exports.translateLinks = translateLinks;
exports.handleLinks = handleLinks;

var url = _interopRequireWildcard(require("url"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
// (C)opyright Dirk Holtwick, 2016-10-28 <dirk.holtwick@gmail.com>
function isAbsoluteURL(url) {
  return url.indexOf('http') === 0;
}

function urlRelative(fromURL, toURL) {
  try {
    // assert(fromURL[0] === '/', `Expected absolute URL ${fromURL}`);
    // assert(toURL[0] === '/', `Expected absolute URL ${toURL}`);
    var fromParts = fromURL.split('/');
    var toParts = toURL.split('/'); // console.log(fromParts, toParts);
    // Find common root

    var indexCommon = 0;

    for (var i = 0; i < fromParts.length - 1; i++) {
      if (toParts[i] === fromParts[i]) {
        indexCommon++;
      } else {
        break;
      }
    }

    fromParts = fromParts.slice(indexCommon);
    toParts = toParts.slice(indexCommon); // console.log(fromParts, toParts);
    // Moving up missing levels

    for (var _i = 0; _i < fromParts.length - 1; _i++) {
      toParts.unshift('..');
    }

    return toParts.join('/');
  } catch (err) {
    //console.error('urlRelative', toURL, err.toString());
    return toURL;
  }
}

var urlElements = [{
  tag: 'a',
  attr: 'href'
}, {
  tag: 'script',
  attr: 'src'
}, {
  tag: 'link',
  attr: 'href'
}, {
  tag: 'img',
  attr: 'src'
}];

function translateLinks($, baseURL) {
  var _loop = function _loop() {
    var info = urlElements[_i2];
    $("".concat(info.tag, "[").concat(info.attr, "]")).each(function (i, e) {
      e = $(e);
      var href = e.attr(info.attr);

      if (/^(mailto|#|https?:)/.test(href)) {
        return;
      }

      var toUrl = url.resolve('/', href);
      var fromUrl = url.resolve('/', baseURL);
      var newHref = urlRelative(fromUrl, toUrl); // console.log('from', href, 'to', newHref);
      // url = urlRelative(url.baseUrl || '/', url);

      e.attr(info.attr, newHref);
    });
  };

  for (var _i2 = 0; _i2 < urlElements.length; _i2++) {
    _loop();
  }
}

function handleLinks($, handle) {
  var _loop2 = function _loop2() {
    var info = urlElements[_i3];
    $("".concat(info.tag, "[").concat(info.attr, "]")).each(function (i, e) {
      e = $(e);
      var href = e.attr(info.attr);

      if (/^(mailto|#|https?:)/.test(href)) {
        return;
      }

      var newHref = handle(href);

      if (newHref) {
        e.attr(info.attr, newHref);
      }
    });
  };

  for (var _i3 = 0; _i3 < urlElements.length; _i3++) {
    _loop2();
  }
} // export function absoluteLinks($, baseURL = '/') {
//     if (baseURL[0] !== '/') {
//         baseURL = '/' + baseURL
//     }
//     handleLinks($, href => {
//         return url.resolve(baseURL, href)
//     })
// }