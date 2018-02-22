// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
// @flow

const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const url = require('url')
const process = require('process')

import {jsx, HTML, prependXMLIdentifier} from './jsx'
import {absoluteLinks} from './relativeurls'
import {mkdir} from './fileutil'
import {rmdir} from './fileutil'
import {walkSync} from './fileutil'
import {Plugin} from './plugins/plugin'

const LOAD_OPTIONS = {
    normalizeWhitespace: true,
}

export class SeaSite {

    constructor(srcPath, basePath = null, opt = {
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

    log(...args) {
        console.log(...args)
    }

    // outPath (urlPath) {
    //     return path.join(this.basePath, urlPath);
    // }

    path(urlPath) {
        return path.join(this.basePath, urlPath)
    }

    exists(urlPath) {
        try {
            let p = this.path(urlPath)
            return !!fs.statSync(p)
        }
        catch (err) {

        }
        return false
    }

    move(fromPath, toPath) {
        this.log(`move ... ${fromPath} -> ${toPath}`)
        fs.renameSync(
            this.path(fromPath),
            this.path(toPath))
    }

    copy(fromPath, toPath) {
        this.log(`copy ... ${fromPath} -> ${toPath}`)
        fs.copyFileSync(
            this.path(fromPath),
            this.path(toPath))
    }

    remove(pattern) {
        for (let p of this.paths(pattern)) {
            this.log(`remove ... ${p}`)
            fs.unlinkSync(this.path(p))
        }
    }

    url(path) {
        if (path[0] !== '/') {
            path = '/' + path
        }
        return path
    }

    absoluteURL(path) {
        return this.opt.baseURL + this.url(path)
    }

    read(urlPath) {
        if (urlPath[0] === '/') {
            urlPath = urlPath.substring(1)
        }
        let inPath = path.join(this.basePath, urlPath)
        return fs.readFileSync(inPath)
    }

    readString(urlPath) {
        try {
            let content = this.read(urlPath).toString()
            // this.log(`  ... read ${urlPath}`);
            return content
        } catch (ex) {

        }
        return null
    }

    write(urlPath, content) {
        if (urlPath[0] === '/') {
            urlPath = urlPath.substring(1)
        }
        let outPath = path.join(this.basePath, urlPath)
        mkdir(path.dirname(outPath))
        this.log(`write ... ${outPath}`)
        fs.writeFileSync(outPath, content)
    }

    writeAsHTML(urlpath, $) {
        absoluteLinks($, urlpath)
        this.write(urlpath, $.html())
    }

    // All URL paths matching pattern
    paths(pattern) {
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

    handleString(content, options = LOAD_OPTIONS) {
        let $ = cheerio.load(content, options)
        $.decorate = function (selector, fn) {
            $(selector).each((i, e) => {
                e = $(e)
                e.replaceWith(fn(HTML(e.html())))
            })
        }
        return $
    }

    readDOM(urlPath) {
        let content = this.readString(urlPath)
        if (content) {
            return this.handleString(content)
        }
        return null
    }

    writeDOM($, urlPath, mode = null) {
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

    handle(pattern, handler) {
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
