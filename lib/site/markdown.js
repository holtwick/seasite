"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMarkdown = parseMarkdown;
exports.markdown = markdown;

var _jsx = require("./jsx");

var fs = require('fs');

var marked = require('marked');

var hljs = require('highlight.js');

var yaml = require('yamljs');

function buildOutline(headers) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    maxLevel: 2,
    "class": {
      '1': 'nav bs-docs-sidenav',
      '2': 'nav',
      '3': 'nav',
      '4': 'nav',
      '5': 'nav'
    }
  };
  var list = '';

  while (headers && headers.length > 0) {
    if (!list) {
      list += "<ul class=\"".concat(opt["class"][level.toString()], "\">");
    }

    var h = headers[0];

    if (h) {
      if (h.level === level) {
        list += "<li><a href=\"#".concat(h.anchor, "\">").concat(h.text, "</a>");
        headers.shift();
        var hh = headers[0];

        if (hh && hh.level > level) {
          list += buildOutline(headers, level + 1);
        }

        list += "</li>";
      } else if (h.level < level) {
        list += '</ul>\n';
        return list;
      } else {
        if (level < opt.maxLevel) {
          list += buildOutline(headers, level + 1);
        } else {
          headers.shift();
        }
      }
    }
  }

  return list;
}

function buildOutlineBS4(headers) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    maxLevel: 2,
    "class": {
      '1': 'nav flex-column',
      '2': 'nav flex-column',
      '3': 'nav flex-column',
      '4': 'nav flex-column',
      '5': 'nav flex-column'
    }
  };
  var list = '';

  while (headers && headers.length > 0) {
    if (!list) {
      list += "<nav class=\"".concat(opt["class"][level.toString()], " nav-level-").concat(level, "\">\n");
    }

    var h = headers[0];

    if (h) {
      if (h.level === level) {
        list += "<a class=\"nav-link nav-link-level-".concat(level, "\" href=\"#").concat(h.anchor, "\">").concat(h.text, "</a>\n");
        headers.shift();
        var hh = headers[0];

        if (hh && hh.level > level) {
          list += buildOutlineBS4(headers, level + 1);
        }
      } else if (h.level < level) {
        list += '</nav>\n';
        return list;
      } else {
        if (level < opt.maxLevel) {
          list += buildOutlineBS4(headers, level + 1);
        } else {
          headers.shift();
        }
      }
    }
  }

  return list;
}

function parseMarkdown(content) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    outline: false,
    bs4: false
  };
  var result = {};
  result.content = content.toString().replace(/^---([\s\S]*?)---/gi, function (_, propString) {
    result.props = yaml.parse(propString.trim());
    return '';
  });
  var props = result.props || {};
  result.props = props;
  opt.outline = opt.outline || props.outline;
  var headers = [];
  var ctr = 0;
  var renderer = new marked.Renderer();

  renderer.heading = function (text, level) {
    var anchor = null;
    text = text.replace(/{#([^}]+)}/, function (m, a) {
      anchor = a;
      return '';
    });

    if (!props.title) {
      props.title = (0, _jsx.unescapeHTML)(text);
      return '';
    }

    if (opt.outline) {
      anchor = anchor || 'outline-' + ++ctr;
      headers.push({
        level: +level,
        anchor: anchor,
        text: text.replace(/<.*?>/g, '').trim()
      });
    }

    if (props.inc) {
      level = +level + +props.inc;
    }

    if (anchor) {
      return "<h".concat(level, " data-anchor=\"").concat(anchor, "\"><a id=\"").concat(anchor, "\" name=\"").concat(anchor, "\" class=\"anchor\" href=\"#").concat(anchor, "\">").concat(text, "</a></h").concat(level, ">");
    }

    return "<h".concat(level, ">").concat(text, "</h").concat(level, ">");
  };

  marked.setOptions({
    gfm: true,
    highlight: function highlight(code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    },
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: props.sanitize == null ? false : props.sanitize,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-',
    renderer: renderer
  });
  result.html = marked(result.content);

  if (opt.outline) {
    if (opt.bs4 === true) {
      result.outline = buildOutlineBS4(headers, headers[0].level);
    } else {
      result.outline = buildOutline(headers, headers[0].level);
    }
  }

  return result;
}

function markdown(content) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    outline: false,
    bs4: false
  };
  return parseMarkdown(content, opt);
}