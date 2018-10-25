"use strict";

var _minify = require("./minify");

describe('Minify', function () {
  it('should do LESS', function () {
    var r = (0, _minify.minifyLESS)('body { color: red } ');
    expect(r).toEqual('body{color:red}');
  });
  it('should do JS', function () {
    var r = (0, _minify.minifyJS)('var aa = 1+2', 'aa += 4');
    expect(r).toEqual('var aa=3;aa+=4;');
  });
});