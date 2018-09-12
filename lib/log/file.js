"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFileHandler = createFileHandler;

var _fs = require("fs");

var _os = require("os");

var _logger = require("./logger");

function createFileHandler(path) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    date: true,
    name: true,
    level: true,
    pretty: true
  };
  var stream;
  var formatter = (0, _logger.createFormatter)(opt);
  return function (messages, context) {
    if (!stream) {
      stream = (0, _fs.createWriteStream)(path, {
        flags: 'a'
      });
    }

    messages = Array.prototype.slice.call(messages);
    formatter(messages, context);
    stream.write(messages.join(' ') + _os.EOL || '\n');
  };
}