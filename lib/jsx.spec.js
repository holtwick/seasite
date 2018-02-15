'use strict';

var _jsx = require('./jsx');

describe('JSX', function () {
    it('jsx', function () {
        var r = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'b',
                null,
                'Bold'
            )
        );
        expect(r).toBe('<div><b>Bold</b></div>');
    });
}); // (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx