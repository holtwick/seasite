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

export function server(port=8080) {
  const app = express()
  const server = new http.Server(app)
  app.use(helmet())
  app.use(cors())

  app.use(function (req, res, next) {
    log('req', req)
    const path = req.path
    res.send(`Path: ${path}`)
  })

  server.listen({
    // host: CONFIG.host,
    port
  }, info => {
    console.info(`Running on`, server.address())
  })
}

