"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disqus = disqus;

var _jsx = require("../site/jsx");

var _assert = _interopRequireDefault(require("assert"));

var _site = require("../site");

var OPT = {
  selector: '.disqus',
  disqusURL: null,
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