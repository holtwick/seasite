/*
 * Copyright (C) 2020 Dirk Holtwick <https://holtwick.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'

const log = require('debug')('signal:server')

export class Page {

  status: 200

  html: 'Hello'

  render() {
    return this.html
  }

}

export class Handler {

  pattern
  handler

  constructor(pattern, handler) {
    this.pattern = pattern
    this.handler = handler
  }

  match(path) {
    return this.pattern.test(path)
  }

}

export class Site {

  queue = []

  handle(pattern, handler) {
    this.queue.push(new Handler(pattern, handler))
  }

  perform(path) {
    let page = new Page()
    for(let handler of this.queue) {
      if (handler.match(path)) {
        handler.handler(page)
      }
    }
    return page
  }

}

export function server(site, port = 8080) {
  const app = express()
  const server = new http.Server(app)
  app.use(helmet())
  app.use(cors())

  app.use(function (req, res, next) {
    log('req', req)
    const path = req.path
    let page = site.perform(path)
    res

      .send(page.render())
  })

  server.listen({
    // host: CONFIG.host,
    port,
  }, info => {
    console.info(`Running on`, server.address())
  })
}

