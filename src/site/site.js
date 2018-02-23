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

// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
// @flow

const fs = require('fs')
const path = require('path')
const process = require('process')

import {dom} from './dom'
import {jsx, HTML, prependXMLIdentifier} from './jsx'
import {absoluteLinks} from './relativeurls'
import {rmdir, mkdir, walkSync} from './fileutil'

const LOAD_OPTIONS = {
    normalizeWhitespace: true,
}

export class SeaSite {

    opt: Object
    basePath: string

    constructor(srcPath: string, basePath: ?string = null, opt: Object = {
        excludePatterns: [],
        includePatterns: [],
        baseURL: '',
    }) {
        this.opt = opt
        if (basePath == null) {
            this.basePath = srcPath
        } else {
            this.basePath = basePath

            // Filter files
            let files = walkSync(srcPath)
            files = files.filter(file =>
                opt.includePatterns.some(pattern => {
                    pattern.lastIndex = 0
                    return pattern.test(file)
                })
                && !(opt.excludePatterns.some(pattern => {
                    pattern.lastIndex = 0
                    // this.log(path, pattern.test(path));
                    return pattern.test(file)
                })))

            // Remove old site copy
            rmdir(basePath)
            mkdir(basePath)

            // Copy site
            this.log(`cloning ... ${srcPath} -> ${basePath}`)
            for (let file of files) {
                let src = path.join(srcPath, file)
                let dst = path.join(basePath, file)
                let data = fs.readFileSync(src)
                mkdir(path.dirname(dst))
                // this.log(`  cloned ... ${dst}`)
                fs.writeFileSync(dst, data)
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

    log(...args:Array<any>) {
        console.log(...args)
    }

    // outPath (urlPath) {
    //     return path.join(this.basePath, urlPath);
    // }

    path(urlPath:string):string {
        return path.join(this.basePath, urlPath)
    }

    exists(urlPath:string) {
        try {
            let p = this.path(urlPath)
            return !!fs.statSync(p)
        }
        catch (err) {

        }
        return false
    }

    move(fromPath:string, toPath:string) {
        this.log(`move ... ${fromPath} -> ${toPath}`)
        fs.renameSync(
            this.path(fromPath),
            this.path(toPath))
    }

    copy(fromPath:string, toPath:string) {
        this.log(`copy ... ${fromPath} -> ${toPath}`)
        fs.copyFileSync(
            this.path(fromPath),
            this.path(toPath))
    }

    remove(pattern:string) {
        for (let p of this.paths(pattern)) {
            this.log(`remove ... ${p}`)
            fs.unlinkSync(this.path(p))
        }
    }

    url(path:string):string {
        if (path[0] !== '/') {
            path = '/' + path
        }
        return path
    }

    absoluteURL(path:string):string {
        return this.opt.baseURL + this.url(path)
    }

    read(urlPath:string):?Buffer {
        if (urlPath[0] === '/') {
            urlPath = urlPath.substring(1)
        }
        let inPath = path.join(this.basePath, urlPath)
        return fs.readFileSync(inPath)
    }

    readString(urlPath:string):?string {
        try {
            let content = this.read(urlPath)
            // this.log(`  ... read ${urlPath}`);
            return content ? content.toString() : null
        } catch (ex) {

        }
        return null
    }

    write(urlPath:string, content:string) {
        if (urlPath[0] === '/') {
            urlPath = urlPath.substring(1)
        }
        let outPath = path.join(this.basePath, urlPath)
        mkdir(path.dirname(outPath))
        this.log(`write ... ${outPath}`)
        fs.writeFileSync(outPath, content)
    }

    writeAsHTML(urlpath:string, $:Function) {
        absoluteLinks($, urlpath)
        this.write(urlpath, $.html())
    }

    // All URL paths matching pattern
    paths(pattern:string|RegExp):Array<string> {
        let urlPaths = []
        if (typeof pattern === 'string') {
            urlPaths = [pattern]
        } else if (pattern instanceof RegExp) {
            urlPaths = walkSync(this.basePath).filter(file => {
                pattern.lastIndex = 0
                return pattern.test(file)
            })
        } else if (Array.isArray(pattern)) {
            urlPaths = pattern
        }
        urlPaths.sort()
        return urlPaths
    }

    handleString(content:string, options:Object = LOAD_OPTIONS):Function {
        return dom(content, options)
    }

    readDOM(urlPath:string) {
        let content = this.readString(urlPath)
        if (content) {
            return this.handleString(content)
        }
        return null
    }

    writeDOM($:Function, urlPath:string, mode:?string = null) {
        let content
        if (mode === 'xml') {
            content = prependXMLIdentifier($.xml())
            // HACK:dholtwick:2016-08-23 Workaround cheerio bug
            content = content.replace(/<!--\[CDATA\[>([\s\S]*?)]]-->/g, '<![CDATA[$1]]>')
        } else {
            absoluteLinks($, '/' + urlPath)
            content = $.html()
        }

        // Strip comments
        content = content.replace(/<!--(.*?)-->/g, '')

        // this.log($.html());
        this.write(urlPath, content)
    }

    handle(pattern:string|RegExp, handler:(any, string)=>?any) {
        let urlPaths = this.paths(pattern)
        for (let urlPath of urlPaths) {
            // this.log(`handle ... ${urlPath}`)
            let content = this.readString(urlPath) || ''
            if (/\.(html?|xml)$/i.test(urlPath)) {
                let xmlMode = /\.xml$/i.test(urlPath)
                // let normalizeWhitespace = false
                let $ = this.handleString(content, {xmlMode})
                let ret = handler($, urlPath)
                if (ret !== false) {
                    if (typeof ret === 'string' && ret !== 'xml') {
                        this.write(urlPath, ret)
                    } else {
                        this.writeDOM($, urlPath, ret)
                    }
                }
            } else {
                let ret = handler(content, urlPath)
                if (ret !== false && ret != null) {
                    this.write(urlPath, ret)
                }
            }
        }
    }

}

process.on('unhandledRejection', function (reason, p) {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

process.on('handledRejection', function (reason, p) {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})
