"use strict";

var _jsx = require("../site/jsx");

var _dom = require("../site/dom");

var _tidy = require("../plugins/tidy");

describe('pugin.tidy', function () {
  it('should add breaks', function () {
    var sample = (0, _jsx.jsx)("div", null, "A ", (0, _jsx.jsx)("br", null), " B ");
    var $ = (0, _dom.html)(sample);
    $.applyPlugins([(0, _tidy.tidy)()]);
    expect($.bodyMarkup()).toBe("<div>A <br>\n B </div>\n");
  });
});