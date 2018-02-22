'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sitemap = require('./sitemap');

Object.keys(_sitemap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sitemap[key];
    }
  });
});

var _blog = require('./blog');

Object.keys(_blog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _blog[key];
    }
  });
});