"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = server;
exports.Site = exports.Handler = exports.Page = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var log = require('debug')('signal:server');

var Page = function () {
  function Page() {
    (0, _classCallCheck2["default"])(this, Page);
    (0, _defineProperty2["default"])(this, "status", void 0);
    (0, _defineProperty2["default"])(this, "html", void 0);
  }

  (0, _createClass2["default"])(Page, [{
    key: "render",
    value: function render() {
      return this.html;
    }
  }]);
  return Page;
}();

exports.Page = Page;

var Handler = function () {
  function Handler(pattern, handler) {
    (0, _classCallCheck2["default"])(this, Handler);
    (0, _defineProperty2["default"])(this, "pattern", void 0);
    (0, _defineProperty2["default"])(this, "handler", void 0);
    this.pattern = pattern;
    this.handler = handler;
  }

  (0, _createClass2["default"])(Handler, [{
    key: "match",
    value: function match(path) {
      return this.pattern.test(path);
    }
  }]);
  return Handler;
}();

exports.Handler = Handler;

var Site = function () {
  function Site() {
    (0, _classCallCheck2["default"])(this, Site);
    (0, _defineProperty2["default"])(this, "queue", []);
  }

  (0, _createClass2["default"])(Site, [{
    key: "handle",
    value: function handle(pattern, handler) {
      this.queue.push(new Handler(pattern, handler));
    }
  }, {
    key: "perform",
    value: function perform(path) {
      var page = new Page();

      var _iterator = _createForOfIteratorHelper(this.queue),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var handler = _step.value;

          if (handler.match(path)) {
            handler.handler(page);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return page;
    }
  }]);
  return Site;
}();

exports.Site = Site;

function server(site) {
  var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8080;
  var app = (0, _express["default"])();
  var server = new _http["default"].Server(app);
  app.use((0, _helmet["default"])());
  app.use((0, _cors["default"])());
  app.use(function (req, res, next) {
    log('req', req);
    var path = req.path;
    var page = site.perform(path);
    res.send(page.render());
  });
  server.listen({
    port: port
  }, function (info) {
    console.info("Running on", server.address());
  });
}