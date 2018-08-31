"use strict";

var _site = require("./site");

describe('Site', function () {
  var files = ['index.html', 'readme.md', 'php/index.html', 'php/todo.php', 'img/logo.png'];
  it('should apply patterns correctly', function () {
    expect((0, _site.filterByPatterns)(files, 'unknown')).toEqual([]);
    expect((0, _site.filterByPatterns)(files, 'index.html')).toEqual(['index.html']);
    expect((0, _site.filterByPatterns)(files, /\.html/)).toEqual(['index.html', 'php/index.html']);
    expect((0, _site.filterByPatterns)(files, /\.html/, 'php')).toEqual(['index.html', 'php/index.html']);
    expect((0, _site.filterByPatterns)(files, /\.html/, 'php/')).toEqual(['index.html']);
    expect((0, _site.filterByPatterns)(files, [/\.html/], ['php/'])).toEqual(['index.html']);
    expect((0, _site.filterByPatterns)(files, ['php/'], [/html/])).toEqual(['php/todo.php']);
  });
});