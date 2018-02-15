'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseMarkdown = parseMarkdown;
exports.readMarkdown = readMarkdown;

var _jsx = require('./jsx');

var fs = require('fs'); // (C)opyright Dirk Holtwick, 2016-08-20 <dirk.holtwick@gmail.com>
// @jsx jsx

var marked = require('marked');
var hljs = require('highlight.js');
var yaml = require('yamljs');

// const dateformat = require('dateformat')

function buildOutline(headers) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        maxLevel: 2,
        class: {
            1: 'nav bs-docs-sidenav',
            2: 'nav',
            3: 'nav',
            4: 'nav',
            5: 'nav'
        }
    };

    var list = '';
    while (headers && headers.length > 0) {
        if (!list) {
            list += '<ul class="' + opt.class[level] + '">';
        }
        var h = headers[0];
        console.log('h', h);
        if (h) {
            if (h.level === level) {
                list += '<li><a href="#' + h.anchor + '">' + h.text + '</a>';
                headers.shift();
                var hh = headers[0];
                if (hh && hh.level > level) {
                    list += buildOutline(headers, level + 1);
                }
                list += '</li>';
            } else if (h.level < level) {
                list += '</ul>\n';
                return list;
            } else {
                if (level < opt.maxLevel) {
                    list += buildOutline(headers, level + 1);
                } else {
                    headers.shift();
                }
            }
        }
    }
    return list;
}

function parseMarkdown(content) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        outline: false
    };

    // Props

    // assert(content != null && content.length > 0 && typeof content === 'string', 'parseMarkdown expects content', content);
    var result = {};
    result.content = content.replace(/^---([\s\S]*?)---/gi, function (_, propString) {
        result.props = yaml.parse(propString.trim());
        return '';
    });
    var props = result.props || {};
    result.props = props;

    opt.outline = opt.outline || props.outline;

    // https://github.com/chjj/marked

    var headers = [];
    var ctr = 0;

    var renderer = new marked.Renderer();
    renderer.heading = function (text, level) {
        var anchor = null; // text.toLowerCase().replace(/[^\w]+/g, '-')
        text = text.replace(/{#([^}]+)}/, function (m, a) {
            anchor = a;
            return '';
        });
        if (opt.outline) {
            anchor = anchor || 'outline-' + ++ctr;
            headers.push({ level: +level, anchor: anchor, text: text });
        }
        if (props.inc) {
            level = +level + +props.inc;
        }
        if (anchor) {
            return '<h' + level + ' id="' + anchor + '"><a name="' + anchor + '" class="anchor" href="#' + anchor + '">' + text + '</a></h' + level + '>';
        }
        return '<h' + level + '>' + text + '</h' + level + '>';
    };

    marked.setOptions({
        gfm: true, //  GitHub flavored markdown.
        highlight: function highlight(code, lang) {
            // console.log(lang);
            return hljs.highlightAuto(code, [lang]).value;
        },
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: props.sanitize == null ? false : props.sanitize,
        smartLists: true,
        smartypants: false,
        langPrefix: 'lang-',
        renderer: renderer
    });
    result.html = marked(result.content);

    if (opt.outline) {
        // result.outline = headers
        // console.log(headers)
        // console.log(buildOutline(headers))
        result.outline = buildOutline(headers);
    }

    // result.outPath = result.outPath.replace(/\.(md|markdown)$/i, '.html');
    return result;
}

function readMarkdown(p) {
    var md = fs.readFileSync(p, 'utf8');
    return marked(md).toString();
}