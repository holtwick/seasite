"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeHTML = escapeHTML;
exports.unescapeHTML = unescapeHTML;
exports.CDATA = CDATA;
exports.HTML = HTML;
exports.prependXMLIdentifier = prependXMLIdentifier;
exports.jsx = jsx;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _dom = require("./dom");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

function unescapeHTML(s) {
  return s.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&apos;/gi, '\'').replace(/&amp;/gi, '&');
}

var USED_JSX = [];

function CDATA(s) {
  s = '<![CDATA[' + s + ']]>';
  USED_JSX.push(s);
  return s;
}

function HTML(s) {
  USED_JSX.push(s);
  return s;
}

function prependXMLIdentifier(s) {
  return '<?xml version="1.0" encoding="utf-8"?>\n' + s;
}

function jsx(tag, attrs) {
  var s = '';
  tag = tag.replace(/__/g, ':');

  if (tag !== 'noop') {
    if (tag !== 'cdata') {
      s += "<".concat(tag);
    } else {
      s += '<![CDATA[';
    }

    for (var name in attrs) {
      if (name && attrs.hasOwnProperty(name)) {
        (function () {
          var v = attrs[name];

          if (name.toLowerCase() === 'classname') {
            name = 'class';
          }

          name = name.replace(/__/g, ':');

          if (v === true) {
            s += " ".concat(name, "=\"").concat(name, "\"");
          } else if (name === 'style' && (0, _typeof2["default"])(v) === 'object') {
            s += " ".concat(name, "=\"").concat(Object.keys(v).filter(function (k) {
              return v[k] != null;
            }).map(function (k) {
              var vv = v[k];
              vv = typeof vv === 'number' ? vv + 'px' : vv;
              return "".concat(k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), ":").concat(vv);
            }).join(';'), "\"");
          } else if (v !== false && v != null) {
            s += " ".concat(name, "=\"").concat(escapeHTML(v.toString()), "\"");
          }
        })();
      }
    }

    if (tag !== 'cdata') {
      s += ">";
    }
  }

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  for (var _i = 0, _children = children; _i < _children.length; _i++) {
    var child = _children[_i];

    if (child != null && child !== false) {
      if (!Array.isArray(child)) {
        child = [child];
      }

      var _iterator = _createForOfIteratorHelper(child),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;

          if (USED_JSX.indexOf(c) !== -1 || tag === 'script' || tag === 'style') {
            s += c;
          } else {
            if ((0, _dom.isDOM)(c)) {
              s += c.bodyMarkup();
            } else {
              s += escapeHTML(c.toString());
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }

  if (tag !== 'noop') {
    if (tag !== 'cdata') {
      s += "</".concat(tag, ">");
    } else {
      s += ']]>';
    }
  }

  USED_JSX.push(s);
  return s;
}