'use strict';

var _jsx = require('./jsx');

var _dom = require('./dom');

var _plugins = require('./plugins');

describe('DOM', function () {

    it('should understand HTML', function () {
        var r = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'b',
                null,
                'Bold'
            )
        );
        var $ = (0, _dom.dom)(r);

        $.applyPlugins([new _plugins.ExamplePlugin('test')], {
            value: 123
        });

        expect($.html()).toBe('<html><head><meta name="test" value="123"></head><body><div><b>Bold</b></div></body></html>');
    });
}); // (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx