"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.href = href;

var url = _interopRequireWildcard(require("url"));

var _relativeurls = require("../site/relativeurls");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var defaults = {
  relative: false,
  handleURL: function handleURL(url) {
    return url;
  },
  ignore: null
};

function href() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, defaults, gopt);
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    opt = Object.assign({}, gopt, opt);
    var baseURL = opt.path || '/';

    if (baseURL[0] !== '/') {
      baseURL = '/' + baseURL;
    }

    (0, _relativeurls.handleLinks)($, function (href) {
      if (opt.ignore) {
        if (opt.ignore.test(href)) {
          return href;
        }
      }

      if (opt.relative) {
        var toUrl = url.resolve('/', href);
        var fromUrl = url.resolve('/', baseURL);
        href = (0, _relativeurls.urlRelative)(fromUrl, toUrl);
      } else {
        href = url.resolve(baseURL, href);
      }

      href = opt.handleURL(href);
      return href;
    });
  };
}