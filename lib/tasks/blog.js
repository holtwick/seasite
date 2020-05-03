"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blog = blog;

var _jsx = require("../site/jsx");

var _dateformat = _interopRequireDefault(require("dateformat"));

var _fs = require("fs");

var _lodash = _interopRequireDefault(require("lodash"));

var _index = require("../index");

var _site = require("../site");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function pathToHTMLPath(path) {
  return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
}

var defaults = {
  folder: 'blog',
  pattern: null,
  handler: null,
  title: 'Blog',
  url: '',
  description: '',
  copyright: '',
  author: '',
  language: 'en-en',
  template: function template(site) {
    return (0, _jsx.jsx)("div", null, (0, _jsx.jsx)("div", {
      id: "content"
    }));
  }
};

function blog(site) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opt = Object.assign({}, defaults, opt);
  var entries = [];

  if (!opt.pattern && opt.folder) {
    opt.pattern = new RegExp(opt.folder + '\/.*\.md$');
  }

  var maxDate;
  site.handle(opt.pattern, function (content, path) {
    if ((0, _site.pathMatchesPatterns)(path, opt.exclude)) {
      return;
    }

    var md = (0, _index.parseMarkdown)(content);
    var props = md.props;
    var html = md.html;
    var title = props.title,
        date = props.date,
        hidden = props.hidden;

    if (hidden || path.indexOf('/-') > 0) {
      return;
    }

    if (typeof date === 'string') {
      var m = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(date);

      if (m) {
        date = new Date(+m[1], +m[2] - 1, +m[3], 12, 0);
      }
    }

    if (!date) {
      var _m = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(path);

      if (_m) {
        date = new Date(+_m[1], +_m[2] - 1, +_m[3], 12, 0);
      }
    }

    if (!date) {
      var stat = (0, _fs.statSync)(site.path(path)) || {};
      date = stat.mtime;
    }

    try {
      if (!date || !maxDate || maxDate.getTime() < date.getTime()) {
        maxDate = date;
      }
    } catch (e) {
      site.log.error(e.toString(), date.constructor.name);
    }

    entries.push({
      html: html,
      props: props,
      title: title,
      date: date,
      hidden: hidden,
      path: path,
      htmlPath: pathToHTMLPath(path),
      url: site.publicURL(pathToHTMLPath(path))
    });
    return false;
  });
  entries = _lodash["default"].sortBy(entries, 'date').reverse();
  var atomContent = (0, _index.xml)((0, _jsx.jsx)("rss", {
    version: "2.0",
    xmlns__atom: "http://www.w3.org/2005/Atom"
  }, (0, _jsx.jsx)("channel", null, (0, _jsx.jsx)("title", null, opt.title), (0, _jsx.jsx)("link", null, opt.url, "/"), (0, _jsx.jsx)("description", null, opt.description), (0, _jsx.jsx)("language", null, opt.language), (0, _jsx.jsx)("copyright", null, opt.copyright), (0, _jsx.jsx)("pubDate", null, (0, _dateformat["default"])(maxDate || new Date(), 'isoDateTime')))));

  var _iterator = _createForOfIteratorHelper(entries),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var post = _step.value;
      var atomEntry = (0, _jsx.jsx)("item", null, (0, _jsx.jsx)("title", null, post.title), (0, _jsx.jsx)("link", null, site.publicURL(post.htmlPath)), (0, _jsx.jsx)("pubDate", null, (0, _dateformat["default"])(post.date, 'isoDateTime')), (0, _jsx.jsx)("author", null, opt.author), (0, _jsx.jsx)("description", null, post.html), (0, _jsx.jsx)("guid", null, post.htmlPath));
      atomContent('channel').append(atomEntry);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  site.writeDOM(atomContent, "".concat(opt.folder, "/atom.xml"));
  site.writeDOM(atomContent, "/atom.xml");
  var $ = (0, _index.dom)(opt.template(site));

  if ($) {
    var group = 'blog';
    $("li[data-group=\"".concat(group, "\"]")).addClass('active');
    $('#content').html((0, _jsx.jsx)("div", null, (0, _jsx.jsx)("h1", {
      className: "blog-post-title"
    }, "Blog"), (0, _jsx.jsx)("ul", null, entries.map(function (post) {
      return (0, _jsx.jsx)("li", null, (0, _jsx.jsx)("a", {
        href: site.url(pathToHTMLPath(post.path))
      }, post.title));
    }))));
    $('title').text(opt.title);
    $('#recent-posts-container').remove();
    site.write("".concat(opt.folder, "/index.html"), $.html());
  }

  return entries;
}