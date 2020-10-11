// (C)opyright by Dirk Holtwick, 2018 <https://holtwick.de/copyright>

'use strict'

export const ansicodes = {
  'reset': '\x1b[0m',
  'bold': '\x1b[1m',
  'italic': '\x1b[3m',
  'underline': '\x1b[4m',
  'blink': '\x1b[5m',
  'black': '\x1b[30m',
  'red': '\x1b[31m',
  'green': '\x1b[32m',
  'yellow': '\x1b[33m',
  'blue': '\x1b[34m',
  'magenta': '\x1b[35m',
  'cyan': '\x1b[36m',
  'white': '\x1b[37m',
}

export function checkAnsiColorsAvailable() {
  try {
    return process.env.CLICOLOR.toString() === '1' && process.type !== 'renderer'
  } catch (err) {
  }
  return false
}
