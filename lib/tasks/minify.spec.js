"use strict";

var _minify = require("./minify");

describe('Minify', function () {
  it('should do LESS', function () {
    var r = (0, _minify.minifyLESS)();
    expect(r).toEqual('');
  });
});