"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sitemap = sitemap;

var _site = require("../site");

var _site2 = require("../site/site");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var defaults = {
  exclude: ['404.html'],
  pattern: /\.html?$/
};

function sitemap(site) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opt = Object.assign({}, defaults, opt);
  var urls = site.paths(opt.pattern, opt.exclude).map(function (path) {
    return site.publicURL(path);
  });
  urls.sort();
  site.write('sitemap.txt', urls.join('\n'));
  var sitemapXML = (0, _site.xml)((0, _site.jsx)("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
  }));

  var _iterator = _createForOfIteratorHelper(urls),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var url = _step.value;
      var atomEntry = (0, _site.jsx)("url", null, (0, _site.jsx)("loc", null, url));
      sitemapXML('urlset').append(atomEntry);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  site.writeDOM(sitemapXML, 'sitemap.xml');

  if (!site.exists('robots.txt')) {
    site.write('robots.txt', "User-agent: *\nSitemap: ".concat(site.publicURL('sitemap.xml')));
  }
}