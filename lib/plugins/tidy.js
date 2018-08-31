"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tidy = tidy;
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