/*
 * Copyright (C) 2018 Dirk Holtwick <https://holtwick.de>
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

// @jsx html
// @flow

const fs = require('fs')
const fsx = require('fs-extra')
const path = require('path')

import log from '../log'
import { dom, isDOM } from './dom'
import { mkdir, rmdir, walkSync } from './fileutil'

type SeaSitePattern = string | RegExp | Array<string | RegExp>

// This is required to bypass systems umask settings
process.umask(0o022)

export function isPattern(pattern: ?SeaSitePattern): boolean {
  return pattern != null && (
    pattern instanceof RegExp ||
    typeof pattern === 'string' ||
    Array.isArray(pattern))
}

export function pathMatchesPatterns(path: string, patterns: SeaSitePattern): boolean {
  let result = (() => {
    if (!Array.isArray(patterns)) {
      patterns = [patterns]
    }
    for (let pattern of patterns) {
      if (typeof pattern === 'string') {

        // Strip leading /
        if (pattern.indexOf('/') === 0) {
          pattern = pattern.substring(1)
        }

        // Match folder ?
        if (pattern[pattern.length - 1] === '/') {
          if (path.indexOf(pattern) === 0) {
            return true
          }
        } else if (path === pattern) {
          return true
        }
      } else if (pattern instanceof RegExp) {
        pattern.lastIndex = 0
        if (pattern.test(path)) {
          return true
        }
      }
    }
    return false
  })()
  // log.info(result, path, patterns)
  return result
}

export function filterByPatterns(paths: ?Array<string>, patterns: ?SeaSitePattern, exclude: ?SeaSitePattern): Array<string> {
  return (paths || [])
    .filter(file => {
      if (pathMatchesPatterns(file, patterns || [])) {
        if (isPattern(exclude)) {
          return !pathMatchesPatterns(file, exclude || [])
        }
        return true
      }
      return false
    })
}

// const LOAD_OPTIONS = {
//     normalizeWhitespace: true,
// }

export class SeaSite {

  opt: Object
  basePath: string
  log: Function

  constructor(srcPath: string, basePath: ?string = null, opt: Object = {
    excludePatterns: null,
    includePatterns: null,
    baseURL: '',
  }) {

    log.setLevel(opt.logLevel || log.INFO)
    this.log = log

    this.opt = opt
    if (basePath == null) {
      this.basePath = srcPath
    } else {
      this.basePath = basePath

      // Filter files
      let files = filterByPatterns(
        walkSync(srcPath),
        opt.includePatterns,
        opt.excludePatterns)

      // Remove old site copy
      rmdir(basePath)
      mkdir(basePath)

      // Copy site
      log.info(`Site creation ... ${srcPath} -> ${basePath}`)
      for (let file of files) {
        let src = path.join(srcPath, file)
        let dst = path.join(basePath, file)
        mkdir(path.dirname(dst))
        fs.copyFileSync(src, dst)

        // let data = fs.readFileSync(src)
        // // log.debug(`  cloned ... ${dst}`)
        // fs.writeFileSync(dst, data, {
        //     mode: 0o644,
        // })
      }
      //     // Paths
      //     let pages = [];
      //     for (let filePath of files) {
      //         let page = {
      //             url: '/' + filePath,
      //             outUrl: '/' + filePath,
      //             name: path.basename(filePath).replace(/\.[^\.]+$/, ''),
      //             dirName: path.dirname(filePath),
      //             fileName: path.basename(filePath),
      //             inPath: path.join(project.inPath, filePath),
      //             outPath: path.join(project.outPath, filePath)
      //         };
      //         pages.push(page);
      //     }
    }
  }

  // Paths

  path(urlPath: string): string {
    return path.join(this.basePath, urlPath)
  }

  // All URL paths matching pattern
  paths(pattern: SeaSitePattern, exclude: ?SeaSitePattern): Array<string> {
    let urlPaths = filterByPatterns(
      walkSync(this.basePath),
      pattern,
      exclude)
    urlPaths.sort()
    return urlPaths
  }

  exists(urlPath: string) {
    try {
      let p = this.path(urlPath)
      return !!fs.statSync(p)
    } catch (err) {

    }
    return false
  }

  // URLs

  url(path: string): string {
    if (path[0] !== '/') {
      path = '/' + path
    }
    return path
  }

  publicURL(path: string): string {
    if (this.opt.publicURL) {
      return this.opt.publicURL(this.url(path))
    }
    return this.opt.baseURL + this.url(path)
  }

  // absoluteURL(path: string): string {
  //     return this.opt.baseURL + this.url(path)
  // }

  // File Actions

  move(fromPath: string, toPath: string) {
    log.debug(`move ... ${fromPath} -> ${toPath}`)
    fs.renameSync(
      this.path(fromPath),
      this.path(toPath))
  }

  copy(fromPath: string, toPath: string) {
    log.debug(`copy ... ${fromPath} -> ${toPath}`)
    fs.copyFileSync(
      this.path(fromPath),
      this.path(toPath))
  }

  copyNPM(moduleName: string, fromRelativePath: string = '', toPath: string = 'npm') {
    log.debug(`copy npm module ${moduleName}/${fromRelativePath} -> ${toPath}`)
    let p = require.resolve(moduleName, {
      paths: [process.cwd()],
    })
    log.assert(!!p, `[site.copyNPM] Could not resolve module ${moduleName}`)
    let rx = /^.*\/node_modules\/[^\/]+/gi
    let m = rx.exec(p)
    log.assert(!!m, `[site.copyNPM] Could not resolve main path ${p} / ${this.basePath}`)
    if (m) {
      p = m[0]
      p = path.join(p, fromRelativePath)
      log.assert(fs.existsSync(p), `[site.copyNPM] Path ${p} does not exist`)
      let d = this.path(toPath)
      mkdir(d)
      fsx.copySync(
        p,
        d)
    }
  }

  remove(pattern: SeaSitePattern) {
    for (let p of this.paths(pattern)) {
      log.debug(`remove ... ${p}`)
      fs.unlinkSync(this.path(p))
    }
  }

  // Read / Write

  read(urlPath: string): ?Buffer {
    try {
      if (urlPath[0] === '/') {
        urlPath = urlPath.substring(1)
      }
      let inPath = path.join(this.basePath, urlPath)
      return fs.readFileSync(inPath)
    } catch (ex) {
      log.error('Failed to .read file:', urlPath)
    }
    return null
  }

  // readAsString(urlPath: string): ?string {
  //
  // }

  write(urlPath: string, content: string | Buffer | Function) {
    if (urlPath[0] === '/') {
      urlPath = urlPath.substring(1)
    }
    let outPath = path.join(this.basePath, urlPath)
    mkdir(path.dirname(outPath))
    log.debug(`write ... ${outPath}`)

    if (typeof content !== 'string') {
      if (isDOM(content)) {
        content = content.html()
      } else {
        content = content.toString()
      }
    }
    fs.writeFileSync(outPath, content, {
      mode: 0o644,
    })
  }

  // DEPRECATED:2018-02-23
  writeDOM($: Function, urlPath: string, opt: ?any) {
    let markup: string

    try {
      markup = $.markup(opt)
    } catch (e) {
      log.error('Problem writing to', urlPath, 'with', $)
      throw e
    }

    // log.debug($.html());
    this.write(urlPath, markup)
  }

  handle(pattern: SeaSitePattern | Object, handler: (any, string) => ?(any | Promise<any>)) {
    // let urlPaths = []
    // if (typeof pattern === 'string') {
    //     urlPaths = [pattern]
    // } else {
    let urlPaths = this.paths(pattern)
    if (!urlPaths || urlPaths.length <= 0) {
      log.warn('Did not match any file for', pattern)
    }
    // }

    for (let urlPath of urlPaths) {
      log.debug(`handle ... ${urlPath}`)

      let content = ''
      if (this.exists(urlPath)) {
        content = this.read(urlPath)
      }

      let result = {
        path: urlPath,
        mode: null,
        content: null,
        ignore: false,
      }

      let ret = null
      if (/\.(html?|xml)$/i.test(urlPath)) {
        let xmlMode = /\.xml$/i.test(urlPath)
        let $ = dom(content, { xmlMode })
        result.content = $
        ret = handler($, urlPath)
      } else {
        result.content = content
        ret = handler(content, urlPath)
      }

      let solve = (ret) => {
        if (ret !== false) {
          if (typeof ret === 'string') {
            ret = { content: ret }
          }
          ret = ret || result || {}
          if (ret.ignore !== true) {
            let p = ret.path || urlPath
            let content = ret.content || result.content
            if (isDOM(content)) {
              this.writeDOM(content, p)
            } else if (content) {
              this.write(p, content)
            } else {
              log.error('Unknown content type for', p, '=>', content)
            }
          }
        }
      }

      if (ret && ret.then) {
        ret.then(solve).catch(err => {
          log.error('Promise error', err)
        })
      } else {
        solve(ret)
      }
    }
  }
}

process.on('unhandledRejection', function (reason, p) {
  log.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

process.on('handledRejection', function (reason, p) {
  log.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})
