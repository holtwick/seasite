"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = server;

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var log = require('debug')('signal:server');

function server() {
  var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8080;
  var app = (0, _express["default"])();
  var server = new _http["default"].Server(app);
  app.use((0, _helmet["default"])());
  app.use((0, _cors["default"])());
  app.use(function (req, res, next) {
    log('req', req);
    var path = req.path;
    res.send("Path: ".concat(path));
  });
  server.listen({
    port: port
  }, function (info) {
    console.info("Running on", server.address());
  });
}