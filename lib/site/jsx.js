"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeHTML = escapeHTML;
exports.unescapeHTML = unescapeHTML;
exports.CDATA = CDATA;
exports.HTML = HTML;
exports.prependXMLIdentifier = prependXMLIdentifier;
exports.jsx = jsx;

var _dom = require("./dom");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
          } else if (name === 'style' && _typeof(v) === 'object') {
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

  for (var _i = 0; _i < children.length; _i++) {
    var child = children[_i];

    if (child != null && child !== false) {
      if (!Array.isArray(child)) {
        child = [child];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = child[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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