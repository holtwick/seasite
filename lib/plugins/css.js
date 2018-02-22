'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CSSPlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.


// Support for Google Analytics integration, respecting do not track

var _plugin = require('./plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CSSPlugin = exports.CSSPlugin = function () {
    function CSSPlugin() {
        _classCallCheck(this, CSSPlugin);
    }

    _createClass(CSSPlugin, [{
        key: 'work',
        value: function work($) {
            // $('link')
        }
    }]);

    return CSSPlugin;
}();