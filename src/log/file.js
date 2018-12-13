// (C)opyright by Dirk Holtwick, 2018 <https://holtwick.de/copyright>

import {createWriteStream} from 'fs'
import {EOL} from 'os'
import {createFormatter} from './logger'

// npm-exec babel-node jslog.js

export function createFileHandler(path, opt = {
  date: true,
  name: true,
  level: true,
  pretty: true
}) {
  let stream
  let formatter = createFormatter(opt)
  return (messages, context) => {
    if (!stream) {
      stream = createWriteStream(path, {
        flags: 'a'
      })
    }

    messages = Array.prototype.slice.call(messages)
    formatter(messages, context)
    stream.write(messages.join(' ') + EOL || '\n')
  }
}

