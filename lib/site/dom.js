"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDOM = isDOM;
exports.toString = toString;
exports.dom = dom;
exports.xml = xml;
exports.html = html;

var _jsx = require("./jsx");

var _log = _interopRequireDefault(require("../log"));

var cheerio = require('cheerio');

{
  var originalHtmlFn = cheerio.prototype.html;

  cheerio.prototype.html = function (value) {
    if (typeof value === 'string') {
      value = fixNonClosingTags(value);
    }

    return originalHtmlFn.call(this, value);
  };
}
{
  var _originalHtmlFn = cheerio.prototype.replaceWith;

  cheerio.prototype.replaceWith = function (value) {
    if (typeof value === 'string') {
      value = fixNonClosingTags(value);
    }

    return _originalHtmlFn.call(this, value);
  };
}

function isDOM(obj) {
  return obj && typeof obj === 'function' && typeof obj.html === 'function';
}

function toString(obj) {
  if (obj) {
    if (obj instanceof Buffer) {
      return toString('utf8');
    } else if (isDOM(obj)) {
      return obj.html();
    }
  }

  return (obj || '').toString();
}

function fixNonClosingTags(value) {
  return value.replace(/<\/(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)>/gi, '');
}

function dom(value) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    normalizeWhitespace: true
  };
  var xmlMode = opt.xmlMode === true;

  if (value instanceof Buffer) {
    value = value.toString('utf8');
  }

  if (!isDOM(value)) {
    if (typeof value !== 'string') {
      value = '';
    } else if (!xmlMode) {
      value = fixNonClosingTags(value);
    }

    value = cheerio.load(value, opt);
  }

  var $ = value;
  $.xmlMode = xmlMode;

  $.applyPlugins = function (plugins) {
    for (var _len = arguments.length, opts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      opts[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var plugin = _step.value;
        plugin.apply(void 0, [$].concat(opts));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  $.decorate = function (selector, fn) {
    $(selector).each(function (i, e) {
      e = $(e);
      e.replaceWith(fn((0, _jsx.HTML)(e.html())));
    });
  };

  $.reload = function (html) {
    $.root().empty().html($.load(html).root());
  };

  function postProcessMarkup(markup) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      stripComments: true,
      stripPHP: false
    };

    if (opt) {
      if (!opt.stripPHP) {
        markup = markup.replace(/&lt;\?(php)?([\s\S]*?)\??&gt;/g, function (m, p1, p2) {
          return "<?php".concat((0, _jsx.unescapeHTML)(p2), "?>");
        });
        markup = markup.replace(/%3C\?(php)?([\s\S]*?)\?%3E/g, function (m, p1, p2) {
          return "<?php".concat(decodeURIComponent(p2), "?>");
        });
        markup = markup.replace(/<!--\?(php)?([\s\S]*?)\?-->/g, '<?php$2?>');
      }

      if (opt.stripComments) {
        markup = markup.replace(/<!--([\s\S]*?)-->/g, '');
      }
    }

    return markup;
  }

  $.markup = function (opt) {
    var markup;

    if ($.xmlMode) {
      markup = '<?xml version="1.0" encoding="utf-8"?>\n' + $.xml();
    } else {
      markup = $.html();

      if (markup.trim().toLowerCase().indexOf('<!doctype ') !== 0) {
        markup = '<!doctype html>\n' + markup;
      }
    }

    return postProcessMarkup(markup, opt);
  };

  $.bodyMarkup = function (opt) {
    var markup = $.xmlMode ? $.xml() : $('body').html();
    return postProcessMarkup(markup, opt);
  };

  return $;
}

function xml(value) {
  return dom(value || '', {
    xmlMode: true
  });
}

function html(value) {
  return dom(value || '');
}