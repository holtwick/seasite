'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExamplePlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

// @jsx jsx

// Support for Google Analytics integration, respecting do not track

var _plugin = require('./plugin');

var _jsx = require('../jsx');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExamplePlugin = exports.ExamplePlugin = function () {
    function ExamplePlugin(value) {
        _classCallCheck(this, ExamplePlugin);

        this.name = value || '';
    }

    _createClass(ExamplePlugin, [{
        key: 'work',
        value: function work($) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                value: 0
            };

            $('head').append((0, _jsx.jsx)('meta', { name: this.name, value: opts.value || 0 }));
        }
    }]);

    return ExamplePlugin;
}();