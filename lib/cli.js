#!/usr/bin/env node
"use strict";

var argv = require('yargs').usage('Usage: $0 <command> [options]').command('init', 'Create a basic sample to get started').example('$0 init', 'Create a basic sample to get started').demandCommand(1).help('h').alias('h', 'help').epilog('(C)opyright 2018 Dirk Holtwick, holtwick.it. All rights reserved.').argv;

var fs = require('fs');

var path = require('path');

var command = argv._[0];

if (command === 'init') {
  var src = path.join(__dirname, '..', 'template');
  var dst = process.cwd();
  var files = ['package.json', 'index.js', path.join('public', 'index.md'), path.join('public', 'template.html')];
  files.forEach(function (name) {
    var p = path.join(dst, name);

    if (fs.existsSync(p)) {
      console.error('File already exists:', p);
      process.exit(1);
    }
  });
  fs.mkdirSync(path.join(dst, 'public'));
  files.forEach(function (name) {
    var s = path.join(src, name);
    var d = path.join(dst, name);
    fs.copyFileSync(s, d);
    console.log('Create ...', name);
  });
  console.log('Done.');
} else {
  console.error('Unknown command:', argv._.join(', '));
}