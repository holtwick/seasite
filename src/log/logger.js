// (C)opyright by Dirk Holtwick, 2018 <https://holtwick.de/copyright>

// @flow

// https://github.com/jonnyreeves/js-logger

import { ansicodes, checkAnsiColorsAvailable } from './colorize'

let log = require('./logger-core')
log.useDefaults()

let LOG_PATH = 'seasite.log'

try {
  LOG_PATH = process.env.LOG_PATH || LOG_PATH
} catch (err) {
}

function translateLogLevel(level) {
  switch (level.toLowerCase()) {
    case 'error' :
      return {
        prefix: 'E|*** ',
        color: 'red',
      }
    case 'warn' :
      return {
        prefix: 'W|**  ',
        color: 'magenta',
      }
    case 'info' :
      return {
        prefix: 'I|*   ',
        color: 'cyan',
      }
    case 'debug' :
      return {
        prefix: 'D|    ',
        color: 'yellow',
      }
    // case 'time' :
    //     return {
    //         prefix: 'T|    ',
    //         color: 'magenta',
    //     }
    default:
      break
  }
  return {
    prefix: 'V|    ',
    color: null,
  }
}

let colors = checkAnsiColorsAvailable()

function prettyFormatMessages(messages) {
  for (let i = 0; i < messages.length; i++) {
    let d = messages[i]
    if (!d) continue
    if (typeof d === 'string') {
      messages[i] = d
    } else {
      try {
        let j = JSON.stringify(d, null, 2)
        if (j.indexOf('\n') >= 0 || j.length > 60) {
          messages[i] = `\n${j}\n`
        } else {
          messages[i] = j
        }
      } catch (err) {
        messages[i] = d.toString()
      }
    }
  }
}

export function createFormatter(opt: any = {
  date: false,
  level: false,
  name: false,
  color: false,
  pretty: false,
}) {
  let alternation = true
  return function (messages: any, context: any) {
    if (opt.name === true && context.name) {
      messages.unshift(`[${context.name}]`)
    }
    if (opt.level === true) {
      let level = translateLogLevel(context.level.name)
      messages.unshift(level.prefix)
    }
    if (opt.date === true) {
      messages.unshift(new Date().toISOString())
    }
    if (opt.color === true && colors) {
      let level = translateLogLevel(context.level.name)
      let c = level.color
      if (c) {
        if (context.level.name.toLowerCase() === 'debug') {
          alternation = !alternation
          c = alternation ? 'white' : c
        }
        messages[0] = ansicodes[c] + messages[0].toString()
        messages.push(ansicodes.reset)
      }
    }
    if (opt.pretty === true) {
      prettyFormatMessages(messages)
    }
  }
}

export function createConsoleHandler(opt: any) {
  return log.createDefaultHandler()
}

export function createNodeConsoleHandler(opt: any) {
  return log.createDefaultHandler({
    formatter: createFormatter({
      name: true,
      level: false,
      color: true,
    }),
  })
}

let logHandler: Array<Function> = [
  createConsoleHandler(),
]

if (colors) {
  logHandler = [
    createNodeConsoleHandler(),
  ]
}

export function addHandler(handler: Function) {
  logHandler.push(handler)
}

export function setLogHandler(handler: Array<Function>) {
  logHandler = handler
}

log.setHandler(function (messages, context) {
  for (let handler of logHandler) {
    try {
      handler(messages, context)
    } catch (err) {
      //
    }
  }
})

try {
  process.on('unhandledRejection', (reason, p) => {
    log.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
  })
  // process.on('handledRejection', function (reason, p) {
  //     console.log('Possibly handled rejection at: Promise ', p, ' reason: ', reason)
  // })
  process.on('uncaughtException', (err) => {
    log.error('Caught exception', err)
  })
} catch (err) {
}

let logger = log
export {
  log,
}
