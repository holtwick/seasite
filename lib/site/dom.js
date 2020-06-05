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

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsx = require("./jsx");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

    var _iterator = _createForOfIteratorHelper(plugins),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var plugin = _step.value;
        plugin.apply(void 0, [$].concat(opts));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  $.applyPluginsAsync = function () {
    var _ref = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(plugins) {
      var _len2,
          opts,
          _key2,
          _iterator2,
          _step2,
          plugin,
          result,
          _args = arguments;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              for (_len2 = _args.length, opts = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                opts[_key2 - 1] = _args[_key2];
              }

              _iterator2 = _createForOfIteratorHelper(plugins);
              _context.prev = 2;

              _iterator2.s();

            case 4:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 12;
                break;
              }

              plugin = _step2.value;
              result = plugin.apply(void 0, [$].concat(opts));

              if (!(result && result.then)) {
                _context.next = 10;
                break;
              }

              _context.next = 10;
              return result;

            case 10:
              _context.next = 4;
              break;

            case 12:
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](2);

              _iterator2.e(_context.t0);

            case 17:
              _context.prev = 17;

              _iterator2.f();

              return _context.finish(17);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 14, 17, 20]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

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