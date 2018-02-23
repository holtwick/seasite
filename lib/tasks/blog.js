'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.blog = blog;

var _index = require('../index');

var _jsx = require('../site/jsx');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// @jsx jsx

function pathToHTMLPath(path) {
    return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
}

var defaults = {
    pattern: /blog\/.*\.md$/,
    handler: null,
    title: 'Blog',
    url: '',
    description: '',
    copyright: '',
    author: '',
    language: 'en-en',
    template: function template(site) {
        return (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)('div', { id: 'content' })
        );
    }
};

function blog(site) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    opt = Object.assign({}, defaults, opt);
    var posts = [];

    // Collect post data
    site.handle(opt.pattern, function (content, path) {
        var md = (0, _index.parseMarkdown)(content);
        var props = md.props;
        var html = md.html;
        var title = props.title,
            date = props.date,
            hidden = props.hidden;

        if (hidden || path.indexOf('/-') > 0) {
            return;
        }
        posts.push({
            html: html,
            props: props,
            title: title,
            date: date,
            hidden: hidden,
            path: path,
            htmlPath: pathToHTMLPath(path)
        });
        return false;
    });

    // Sort the posts
    posts = _lodash2.default.sortBy(posts, 'date').reverse();

    // RSS
    (0, _index.setXMLMode)(true);
    var atomContent = site.handleString((0, _jsx.jsx)(
        'rss',
        { version: '2.0', xmlns__atom: 'http://www.w3.org/2005/Atom' },
        (0, _jsx.jsx)(
            'channel',
            null,
            (0, _jsx.jsx)(
                'title',
                null,
                opt.title
            ),
            (0, _jsx.jsx)(
                'link',
                null,
                opt.url,
                '/'
            ),
            (0, _jsx.jsx)(
                'description',
                null,
                opt.description
            ),
            (0, _jsx.jsx)(
                'language',
                null,
                opt.language
            ),
            (0, _jsx.jsx)(
                'copyright',
                null,
                opt.copyright
            ),
            (0, _jsx.jsx)(
                'pubDate',
                null,
                (0, _dateformat2.default)(new Date(), 'isoDateTime')
            )
        )
    ), { xmlMode: true });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = posts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var post = _step.value;

            var atomEntry = (0, _jsx.jsx)(
                'item',
                null,
                (0, _jsx.jsx)(
                    'title',
                    null,
                    post.title
                ),
                (0, _jsx.jsx)(
                    'link',
                    null,
                    site.absoluteURL(post.htmlPath)
                ),
                (0, _jsx.jsx)(
                    'pubDate',
                    null,
                    (0, _dateformat2.default)(post.date, 'isoDateTime')
                ),
                (0, _jsx.jsx)(
                    'author',
                    null,
                    opt.author
                ),
                (0, _jsx.jsx)(
                    'description',
                    null,
                    post.html
                ),
                (0, _jsx.jsx)(
                    'guid',
                    null,
                    post.htmlPath
                )
            );
            atomContent('channel').append(atomEntry);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    (0, _index.setXMLMode)(false);

    var xml = (0, _index.prependXMLIdentifier)(atomContent.xml());
    site.write('/blog/atom.xml', xml);
    site.write('/atom.xml', xml);

    // Blog Archive
    var $ = (0, _index.dom)(opt.template(site));
    if ($) {
        var group = 'blog';
        $('li[data-group="' + group + '"]').addClass('active');
        $('#content').html((0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'h1',
                { className: 'blog-post-title' },
                'Blog'
            ),
            (0, _jsx.jsx)(
                'ul',
                null,
                posts.map(function (post) {
                    return (0, _jsx.jsx)(
                        'li',
                        null,
                        (0, _jsx.jsx)(
                            'a',
                            { href: site.url(pathToHTMLPath(post.path)) },
                            post.title
                        )
                    );
                })
            )
        ));
        $('title').text(opt.title);
        $('#recent-posts-container').remove();
        site.write('/blog/index.html', $.html());
    }

    return posts;
}