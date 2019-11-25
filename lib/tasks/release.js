"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.release = release;

var _fs = require("fs");

var _index = require("../index");

var defaults = {
  folder: 'release',
  pattern: null
};

function release(site) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opt = Object.assign({}, defaults, opt);

  if (!opt.pattern && opt.folder) {
    opt.pattern = new RegExp(opt.folder + '\/.*\.(zip|exe|dmg|AppImage)$');
  }

  var entries = site.paths(opt.pattern).filter(function (p) {
    return /\.\d+(b\d+)?(-\d+)?\.(zip|exe|dmg|AppImage)$/.test(p);
  }).map(function (path) {
    var r = /(^.+[^\d.])((\d+)\.(\d+)(\.(\d+))?(\.(\d+))?(b(\d+))?)(-(\d+))?\.[^.]+$/.exec(path);
    var prefix = r[1];
    var version = r[2];
    var major = +r[3] || 0;
    var minor = +r[4] || 0;
    var patch = +r[6] || 0;
    var fix = +r[8] || 0;
    var beta = +r[10] || 0;
    var build = +r[12] || 0;
    var descPath = "".concat(prefix).concat(version, ".md");

    if (!(0, _fs.existsSync)(site.path(descPath))) {
      descPath = null;
    }

    if (opt.skipMD || descPath) {
      var stat = (0, _fs.statSync)(site.path(path)) || {};
      return {
        date: stat.mtime,
        size: stat.size,
        major: major,
        minor: minor,
        patch: patch,
        fix: fix,
        beta: beta,
        version: version,
        build: build,
        path: path,
        prefix: prefix,
        descPath: descPath
      };
    }
  }).filter(function (o) {
    return !!o;
  }).sort(function (a, b) {
    var r;
    r = a.build - b.build;

    if (r === 0) {
      r = a.major - b.major;

      if (r === 0) {
        r = a.minor - b.minor;

        if (r === 0) {
          r = a.patch - b.patch;

          if (r === 0) {
            r = a.fix - b.fix;

            if (r === 0) {
              r = a.beta - b.beta;
            }
          }
        }
      }
    }

    return r;
  }).reverse();
  return entries;
}