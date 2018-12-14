"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = handle;

var _index = require("../index");

var _log = _interopRequireDefault(require("../log"));

var _site = require("../site");

function pathToHTMLPath(path) {
  return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
}

var defaults = {
  pattern: /.*/,
  plugins: []
};

function handle(site) {
  var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var pages = [];
  var plugins = gopt.plugins;
  gopt = Object.assign({}, defaults, gopt);
  site.handle(gopt.pattern, function ($, path) {
    if ((0, _site.isPattern)(gopt.exclude) && (0, _site.pathMatchesPatterns)(path, gopt.exclude)) {
      return false;
    }

    var opt = Object.assign({}, defaults, gopt, {
      site: site,
      path: path
    });

    if ((0, _site.isDOM)($) && plugins && plugins.length) {
      $.applyPlugins(plugins, opt);
    }

    if (!opt.handler) {
      _log.default.warn('[task.handle] Will not write', path);

      return false;
    }

    if (opt.handler($, path) === false) {
      return false;
    }

    pages.push(opt);
  });
  return pages;
}