"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.example = example;

var _jsx = require("../site/jsx");

function example() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      value: 0
    };
    $('head').append((0, _jsx.jsx)("meta", {
      name: name,
      value: opt.value || 0
    }));
  };
}