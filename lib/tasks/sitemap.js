"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sitemap = sitemap;

var _site = require("../site/site");

var _log = _interopRequireDefault(require("../log"));

var defaults = {
  exclude: ['404.html'],
  pattern: /\.html?$/
};

function sitemap(site) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opt = Object.assign({}, defaults, opt);
  var sitemap = site.paths(opt.pattern, opt.exclude).map(function (path) {
    return site.publicURL(path);
  });
  sitemap.sort();
  site.write('sitemap.txt', sitemap.join('\n'));

  if (!site.exists('robots.txt')) {
    site.write('robots.txt', "User-agent: *\nSitemap: ".concat(site.publicURL('sitemap.txt')));
  }
}