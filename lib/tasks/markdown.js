'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.markdown = markdown;

var _index = require('../index');

var _dom = require('../dom');

var _jsx = require('../jsx');

var _site = require('../site');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pathToHTMLPath(path) {
    return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
} /*
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

var defaults = {
    pattern: /.*\.md$/,
    template: function template(site) {
        return (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)('div', { id: 'content' })
        );
    },
    handle: function handle($, opt) {}
};

function markdown(site) {
    var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var pages = [];
    gopt = Object.assign({}, defaults, gopt);

    var plugins = [_index.plugin.href(), _index.plugin.meta()];

    site.handle(gopt.pattern, function (content, path) {
        var md = (0, _index.parseMarkdown)(content);
        var props = md.props;
        var html = md.html;

        var opt = Object.assign({}, defaults, gopt, props, {
            html: html,
            content: content,
            path: path,
            outline: md.outline
        });

        // console.log('[markdown.]', opt)

        var $ = (0, _dom.dom)(gopt.template(site, opt));

        var group = props.group || 'blog';
        $('li[data-group="' + group + '"]').addClass('active');

        var related = (props.related || '').trim().split(',').map(function (v) {
            return v.trim();
        }).filter(function (v) {
            return !!v;
        });
        $('#content').html((0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'h1',
                { className: 'blog-post-title' },
                props.title
            ),
            group === 'blog' && (0, _jsx.jsx)(
                'p',
                { className: 'blog-post-meta' },
                (0, _dateformat2.default)(props.date, 'longDate')
            ),
            (0, _index.HTML)(html),
            related.length > 0 && (0, _jsx.jsx)(
                'div',
                { className: 'blog-post-related' },
                (0, _jsx.jsx)(
                    'h4',
                    null,
                    'Related Posts'
                ),
                (0, _jsx.jsx)(
                    'ul',
                    null,
                    related.map(function (r) {
                        return (0, _jsx.jsx)(
                            'li',
                            null,
                            (0, _jsx.jsx)(
                                'a',
                                { href: r + '.html' },
                                r
                            )
                        );
                    })
                )
            )
        ));

        if (md.outline) {
            $('#sidebar').html((0, _jsx.jsx)(
                'nav',
                { id: 'outline', className: 'bs-docs-sidebar hidden-print hidden-sm hidden-xs', 'data-spy': 'affix',
                    'data-offset-top': '68' },
                (0, _index.HTML)(md.outline),
                (0, _jsx.jsx)(
                    'a',
                    { href: '#top', className: 'back-to-top' },
                    ' Back to top '
                )
            ));
            $('body').attr('data-spy', 'scroll').attr('data-target', '#outline');
            $('#content').addClass('doc');
        } else if (group === 'blog' || group === 'index') {
            var well = [],
                ct = 3;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = pages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var post = _step.value;

                    if (ct <= 0) break;
                    if (post.path !== path) {
                        well.push((0, _jsx.jsx)(
                            'li',
                            null,
                            (0, _dateformat2.default)(post.date, 'longDate'),
                            (0, _jsx.jsx)('br', null),
                            (0, _jsx.jsx)(
                                'a',
                                { href: site.url(pathToHTMLPath(post.path)) },
                                post.title
                            )
                        ));
                        --ct;
                    }
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

            $('#recent-posts').html(well.join(''));
        } else {
            $('#recent-posts-container').remove();
        }

        $.applyPlugins(plugins, Object.assign({}, opt, {
            path: path
        }));

        // absoluteLinks($, path)
        // $('title').text(`${WEBSITE_TITLE} - ${props.title}`)
        opt.html = $.html();
        pages.push(opt);

        site.write(pathToHTMLPath(opt.path), opt.html);
    });

    return pages;
}