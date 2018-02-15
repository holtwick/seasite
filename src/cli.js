#!/usr/bin/env node
// (C)opyright by Dirk Holtwick, 2018 <https://holtwick.de/copyright>

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
    console.log('Hello World', argv._, process.cwd())

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
    })
}
else {
    console.error('Unknown command:', argv._.join(', '))
}
