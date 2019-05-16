"use strict";

var _index = require("../plugins/index");

var _dom = require("./dom");

var _jsx = require("./jsx");

describe('DOM', function () {
  it('should understand HTML', function () {
    var r = (0, _jsx.jsx)("div", null, (0, _jsx.jsx)("b", null, "Bold"));
    var $ = (0, _dom.dom)(r);
    $.applyPlugins([(0, _index.example)('test')], {
      value: 123
    });
    expect($.html()).toBe('<html><head><meta name="test" value="123"></head><body><div><b>Bold</b></div></body></html>');
  });
  it('should know about XML', function () {
    var x = (0, _dom.xml)((0, _jsx.jsx)("div", null));
    expect(x.xmlMode).toBe(true);
    expect(x.markup()).toBe('<?xml version="1.0" encoding="utf-8"?>\n<div/>');
    var h = (0, _dom.html)((0, _jsx.jsx)("div", null));
    expect(h.xmlMode).toBe(false);
    expect(h.markup()).toBe('<!doctype html>\n<html><head></head><body><div></div></body></html>');
  });
  it('should decode URI for PHP', function () {
    var sample = '/buy-fallback?coupon=%3C?%20echo%20$_GET[%27coupon%27]);?%3E';
    var markup = sample.replace(/%3C\?(php)?(.*?)\?%3E/g, function (m, p1, p2) {
      return "<?php".concat(decodeURIComponent(p2), "?>");
    });
    expect(markup).toBe('/buy-fallback?coupon=<?php echo $_GET[\'coupon\']);?>');
  });
  it('should decode HTML for PHP', function () {
    var sample = '<a href="?coupon=&lt;?php echo $_GET[&apos;coupon&apos;] ?? &apos;&apos;;?&gt;">Buy</a>';
    var markup = (0, _dom.html)(sample).bodyMarkup();
    expect(markup).toBe('<a href="?coupon=<?php echo $_GET[\'coupon\'] ?? \'\';?>">Buy</a>');
  });
  it('should not duplicate <br>', function () {
    var sample = (0, _jsx.jsx)("div", null, "A ", (0, _jsx.jsx)("br", null), " B ");
    expect(sample).toBe("<div>A <br></br> B </div>");
    var $ = (0, _dom.html)(sample);
    expect($.bodyMarkup()).toBe("<div>A <br> B </div>");
    $.reload('<div>A <br/> C </div>');
    expect($.bodyMarkup()).toBe("<div>A <br> C </div>");
    $('div').html((0, _jsx.jsx)("b", null, "X", (0, _jsx.jsx)("br", null), "Y"));
    expect($.bodyMarkup()).toBe("<div><b>X<br>Y</b></div>");
  });
  it('should understand different input types', function () {
    var sample = (0, _jsx.jsx)("div", null, "lorem");
    expect(sample).toBe("<div>lorem</div>");
    expect((0, _dom.html)(sample).bodyMarkup()).toBe("<div>lorem</div>");
    expect((0, _dom.html)(Buffer.from(sample)).bodyMarkup()).toBe("<div>lorem</div>");
    expect((0, _dom.html)((0, _dom.html)(sample)).bodyMarkup()).toBe("<div>lorem</div>");
    expect((0, _dom.html)(new Date()).bodyMarkup()).toBe("");
  });
  it('should handle target correctly', function () {
    var sample = '<li><a class="text-muted" href="https://twitter.com/collectallapp" target="_blank">Twitter</a></li>';
    var $ = (0, _dom.html)(sample);
    $('[target="_blank"]').attr('rel', 'noopener');
    var markup = $.bodyMarkup();
    expect(markup).toBe('<li><a class="text-muted" href="https://twitter.com/collectallapp" target="_blank" rel="noopener">Twitter</a></li>');
  });
});