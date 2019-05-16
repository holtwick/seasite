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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var post = _step.value;
      var atomEntry = (0, _jsx.jsx)("item", null, (0, _jsx.jsx)("title", null, post.title), (0, _jsx.jsx)("link", null, site.publicURL(post.htmlPath)), (0, _jsx.jsx)("pubDate", null, (0, _dateformat["default"])(post.date, 'isoDateTime')), (0, _jsx.jsx)("author", null, opt.author), (0, _jsx.jsx)("description", null, post.html), (0, _jsx.jsx)("guid", null, post.htmlPath));
      atomContent('channel').append(atomEntry);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
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