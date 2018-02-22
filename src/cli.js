#!/usr/bin/env node

/*
 * Copyright (C) 2018 Dirk Holtwick <https://holtwick.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('init', 'Create a basic sample to get started')
    .example('$0 init', 'Create a basic sample to get started')
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .epilog('(C)opyright 2018 Dirk Holtwick, holtwick.it. All rights reserved.')
    .argv

var fs = require('fs')
// var s = fs.createReadStream(argv.file);

// var lines = 0;
// s.on('data', function (buf) {
//     lines += buf.toString().match(/\n/g).length;
// });
//
// s.on('end', function () {
//     console.log(lines);
// });

const path = require('path')

const command = argv._[0]
if (command === 'init') {
    const src = path.join(__dirname, '..', 'template')
    const dst = process.cwd()

    const files = [
        'package.json',
        'index.js',
        path.join('public', 'index.md'),
        path.join('public', 'template.html'),
    ]

    files.forEach(name => {
        let p = path.join(dst, name)
        if (fs.existsSync(p)) {
            console.error('File already exists:', p)
            process.exit(1)
        }
    })

    fs.mkdirSync(path.join(dst, 'public'))
    files.forEach(name => {
        let s = path.join(src, name)
        let d = path.join(dst, name)
        fs.copyFileSync(s, d)
        console.log('Create ...', name)
    })
    console.log('Done.')
}
else {
    console.error('Unknown command:', argv._.join(', '))
}
