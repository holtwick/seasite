"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minify = minify;

var _site = require("../site/site");

var _log = _interopRequireDefault(require("../log"));

var UglifyJS = require("uglify-js");

var defaults = {
  jsopts: {},
  cssopts: {}
};

function minify(site) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opt = Object.assign({}, defaults, opt);
  var sitemap = site.paths(opt.pattern, opt.exclude).map(function (path) {
    return site.publicURL(path);
  });
  var result = UglifyJS.minify(code);
  sitemap.sort();
  site.write('sitemap.txt', sitemap.join('\n'));

  if (!site.exists('robots.txt')) {
    site.write('robots.txt', "User-agent: *\nSitemap: ".concat(site.publicURL('sitemap.txt')));
  }
}