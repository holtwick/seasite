"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localize = localize;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _log = _interopRequireDefault(require("../log"));

var OPT = {};

function localize() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  gopt = Object.assign({}, OPT, gopt);
  var strings = {};

  function loadStrings(opt) {
    var lang = opt.lang.toLowerCase();

    _log["default"].assert(!!lang, '[plugin.localize] opt.lang required');

    if (lang) {
      var stringsPath = _path["default"].join(process.cwd(), 'languages', "".concat(lang, ".json"));

      try {
        strings = opt.strings || JSON.parse(_fs["default"].readFileSync(stringsPath, {
          encoding: 'utf8'
        })) || {};
      } catch (e) {
        _log["default"].warn('[plugin.localize] Error loading strings for', lang, '=>', e.toString());

        strings = {};
      }
    }
  }

  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    opt = Object.assign({}, gopt, opt);
    var lang = opt.lang.toLowerCase();

    _log["default"].assert(!!lang, '[plugin.localize] opt.lang required');

    if (lang) {
      loadStrings(opt);

      var translateString = function translateString(s) {
        var sr = strings[s] || strings[s.trim()];

        if (!sr && opt.missing) {
          opt.missing[s.trim()] = s.trim();
        }

        return sr || s;
      };

      if (typeof $ === 'string') {
        var s = $;

        _log["default"].info('Translate', $);

        while (s.indexOf('_') === 0) {
          s = s.substr(1);
        }

        return translateString(s);
      }

      var fn = function fn(m, p, f, s) {
        if (s && f !== '_blank') {
          return p + translateString(s);
        }

        return m;
      };

      var html = $.html();
      html = html.replace(/(>\s*)(__?([^<]+))/gm, fn);
      html = html.replace(/(")(__?([^"]+))/gm, fn);
      html = html.replace(/(')(__?([^']+))/gm, fn);
      html = html.replace(/(&apos;)(__?([^&]+))/gm, fn);
      $.reload(html);
      $("*[data-lang]:not([data-lang=".concat(lang, "])")).remove();
      $("*[data-lang]").removeAttr('data-lang');
    }
  };
}