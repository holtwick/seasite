"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disqus = disqus;

var _site = require("../site");

var _jsx = require("../site/jsx");

var _assert = _interopRequireDefault(require("assert"));

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
// @jsx jsx
var OPT = {
  selector: '.disqus',
  disqusURL: null,
  // 'https://xxx.disqus.com/embed.js',
  privacyURL: '/privacy#comment'
};

function disqus() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, OPT, gopt);
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    opt = Object.assign({}, gopt, opt);
    (0, _assert.default)(opt.selector, '"selector" required');
    (0, _assert.default)(opt.path, '"path" required');
    (0, _assert.default)((0, _site.isAbsoluteURL)(opt.url), '"url" needs to be absolute');
    $(opt.selector).each(function (i, el) {
      var containerElement = $(el);
      var id = opt.path.replace(/\..+?$/, '').replace(/\/-/, '/');
      var url = opt.url;
      var html = (0, _jsx.jsx)("div", null, (0, _jsx.jsx)("div", {
        id: "disqus_thread",
        style: "display: none;"
      }, (0, _jsx.jsx)("blockquote", null, (0, _jsx.jsx)("p", null, "The comment functionality is provided by ", (0, _jsx.jsx)("a", {
        href: "https://disqus.com"
      }, "Disqus"), ".", (0, _jsx.jsx)("br", null), "Learn more about it in our ", (0, _jsx.jsx)("a", {
        href: opt.privacyURL
      }, "Privacy Policy"), "."), (0, _jsx.jsx)("p", null, (0, _jsx.jsx)("br", null), (0, _jsx.jsx)("button", {
        onClick: "showComments();return false;",
        className: "btn btn-default"
      }, "Open Comments")))), (0, _jsx.jsx)("script", null, "\n                document.getElementById('disqus_thread').style.display = 'block'\n                var disqus_config = function () {\n                    this.page.url = '".concat(url, "'\n                    this.page.identifier = '").concat(id, "'\n                }\n                function showComments() {\n                    document.getElementById('disqus_thread').innerHTML = 'Loading...';\n                    (function () { // DON'T EDIT BELOW THIS LINE\n                        var d = document, s = d.createElement('script')\n                        s.src = '").concat(opt.disqusURL, "'\n                        s.setAttribute('data-timestamp', +new Date());\n                        (d.head || d.body).appendChild(s)\n                    })()\n                }\n                ")));
      containerElement.replaceWith(html);
    });
  };
}