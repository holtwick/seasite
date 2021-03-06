"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = markdown;

var _index = require("../index");

var _site = require("../site");

function pathToHTMLPath(path) {
  return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
}

var defaults = {
  pattern: /.*\.md$/,
  template: function template(site) {
    return (0, _index.jsx)("div", null, (0, _index.jsx)("div", {
      id: "content"
    }));
  },
  handle: function handle($, opt) {}
};

function markdown(site) {
  var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var pages = [];
  gopt = Object.assign({}, defaults, gopt);
  var plugins = [_index.plugin.href(), _index.plugin.meta()];
  site.handle(gopt.pattern, function (content, path) {
    if ((0, _site.pathMatchesPatterns)(path, gopt.exclude)) {
      return false;
    }

    var md = (0, _index.parseMarkdown)(content, {
      bs4: gopt.bs4
    });
    var props = md.props;
    var html = md.html;
    var opt = Object.assign({}, defaults, gopt, props, {
      html: html,
      content: content,
      path: path,
      outline: md.outline
    });
    var $ = (0, _index.dom)(gopt.template(site, opt));
    opt.handle($, opt);
    $.applyPlugins(plugins, Object.assign({}, opt, {
      path: path
    }));
    opt.html = $.html();
    pages.push(opt);

    if (gopt.cleanup === true) {
      site.remove(path);
    }

    site.write(pathToHTMLPath(opt.path), opt.html);
  });
  return pages;
}