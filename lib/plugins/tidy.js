"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tidy = tidy;
exports.tidyCSS = tidyCSS;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _site = require("../site");

var _jsx = require("../site/jsx");

var defaults = {};

function tidy() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, defaults, gopt);
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var html = $.html();
    html = html.replace(/(<(meta|link|script|img|hr|br)[^>]*>)(\s*\n)*/gi, '$1\n');
    html = html.replace(/(<\/(p|h1|h2|h3|h4|h5|h6|blockquote|div|ul|ol|li|article|section|footer)>)(\s*\n)*/gi, '$1\n');
    $.reload(html);
  };
}

function tidyCSS() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, defaults, gopt);
  return function () {
    var _ref = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee($, opt) {
      var styles, css, html, r;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              styles = $('style[type="text/css"]');
              css = [];
              styles.each(function (i, el) {
                css.push($(el).html());
              });
              styles.replaceWith('');
              html = $.html() + '\n' + (gopt.additionalContent || '');
              _context.next = 7;
              return (0, _site.purgeCSS)(html, css.join('\n'));

            case 7:
              r = _context.sent;

              if (r) {
                $('head').append("<style type=\"text/css\">".concat(r, "</style>"));
              }

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}