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

// (C)opyright Dirk Holtwick, 2016-08-20 <dirk.holtwick@gmail.com>
// @jsx html

import {SeaSite, parseMarkdown, prependXMLIdentifier, setXMLMode, dom} from '../index'
import {pathMatchesPatterns} from '../site'
import {jsx} from '../site/jsx'
import dateformat from 'dateformat'
import _ from 'lodash'
import {statSync, existsSync} from 'fs'

// interface ReleaseInfo {
//     version: string,
//     build: string,
//     downloadPath: string,
//     content: string
// }

let defaults = {
    folder: 'blog',
    pattern: null,
}

export function release(site: SeaSite, opt: Object = {}): Array<Object> {

    opt = Object.assign({}, defaults, opt)

    if (!opt.pattern && opt.folder) {
        opt.pattern = new RegExp(opt.folder + '\/.*\.zip$')
    }

    let entries = site.paths(opt.pattern)
        .filter(p => /\.\d+(-\d+)?\.zip$/.test(p))
        .map(path => {
            const r = /(^.+)((\d+)\.(\d+)\.(\d+)(\.(\d+))?)(-(\d+))?\.[^\.]+$/.exec(path)

            const prefix = r[1]
            const version = r[2]
            const major = +r[3] || 0
            const minor = +r[4] || 0
            const patch = +r[5] || 0
            const fix = +r[7] || 0
            const build = +r[9] || 0

            const descPath = `${prefix}${version}.md`
            if (existsSync(site.path(descPath))) {
                // const md = readMarkdown(pp)
                // if (md) {
                // console.log(pp, md);

                const stat = statSync(site.path(path)) || {}
                return {
                    date: stat.mtime, // creation time
                    major,
                    minor,
                    patch,
                    fix,
                    version,
                    build,
                    // md,
                    path,
                    prefix,
                    descPath,
                }
            }
        })
        .filter(o => !!o) // exclude empty ones
        .sort((a, b) => { // by build and version numbers
            let r
            r = a.build - b.build
            if (r === 0) {
                r = a.major - b.major
                if (r === 0) {
                    r = a.minor - b.minor
                    if (r === 0) {
                        r = a.patch - b.patch
                        if (r === 0) {
                            r = a.fix - b.fix
                        }
                    }
                }
            }
            return r
        })
        .reverse()

    return entries

    // ----------- BUILDS --------------
    //
    // const BUILDSPATH = './builds'
    // const DOWNLOADS = fs.readdirSync(BUILDSPATH)
    //     .filter(p => /\.\d+(-\d+)?\.zip$/.test(p))
    //     .map(filename => {
    //         const r = /((\d+)\.(\d+)\.(\d+)(\.(\d+))?)(-(\d+))?/.exec(filename)
    //         // console.log(r, filename)
    //         const version = r[1]
    //         const pp = path.join(BUILDSPATH, `Receipts-${version}.md`)
    //         const md = readMarkdown(pp)
    //         if (md) {
    //             // console.log(pp, md);
    //             return {
    //                 major: +r[2] || 0,
    //                 minor: +r[3] || 0,
    //                 patch: +r[4] || 0,
    //                 fix: +r[6] || 0,
    //                 version,
    //                 build: +r[8] || 0,
    //                 md,
    //                 filename
    //             }
    //         }
    //     })
    //     .filter(o => !!o)
    //     .sort((a, b) => {
    //         let r
    //         r = a.build - b.build
    //         if (r === 0) {
    //             r = a.major - b.major
    //             if (r === 0) {
    //                 r = a.minor - b.minor
    //                 if (r === 0) {
    //                     r = a.patch - b.patch
    //                     if (r === 0) {
    //                         r = a.fix - b.fix
    //                     }
    //                 }
    //             }
    //         }
    //         return r
    //     })
    //     .reverse()
    //
    // // console.log('[makeDownloads.makeDownloads]', DOWNLOADS)
    //
    // // ----------- URLS --------------
    //
    // const APP_VERSION = DOWNLOADS[0].version
    // const DOWNLOAD_URL_DIRECT = `/download/${DOWNLOADS[0].filename}`
    //
    // // ------- SPARKLE ----------------
    //
    // site.handle('sparklecast.xml', $ => {
    //     setXMLMode(true)
    //     let downloadTexts = DOWNLOADS.map(info => {
    //         const fileName = info.filename
    //         const distPath = path.join(BUILDSPATH, fileName)
    //         // const projectRoot = normalizeTilde(`~/work/receipts`);
    //         const stat = fs.statSync(distPath)
    //         if (!stat) {
    //             throw `File ${distPath} does not exist!`
    //         }
    //         /*const date = new Date(stat.ctime);*/
    //         // console.log(date);
    //         // const dsaSignature = execSync(`${projectRoot}/Scripts/sign_update ${distPath} ${projectRoot}/License/dsa_priv.pem`);
    //         /*sparkle__dsaSignature={dsaSignature}*/
    //         return <item>
    //             <title>Version {info.version}</title>
    //             <description>
    //                 <cdata>
    //                     {HTML(info.md)}
    //                     <hr/>
    //                     <p>For details about previous changes visit <a
    //                         href={site.absoluteURL('changelog.html')}>{site.absoluteURL('changelog.html')}</a>.
    //                     </p>
    //                     <p>
    //                         <b>In case of update problems please download the current version directly from <a
    //                             href="https://www.receipts-app.com">https://www.receipts-app.com</a> or contact <a
    //                             href="https://www.receipts-app.com/support.html">support</a>.</b>
    //                     </p>
    //                 </cdata>
    //             </description>
    //             {/* <pubDate>Sat, 26 Jul 2014 15:20:11 +0000</pubDate> */}
    //             <pubDate>{stat.ctime.toGMTString()}</pubDate>
    //             <enclosure url={`https://www.receipts-app.com/update/download/${fileName}`}
    //                        length={stat.size.toString()}
    //                        type="application/octet-stream"
    //                        sparkle__version={info.build}
    //                        sparkle__shortVersionString={info.version}
    //                        sparkle__minimumSystemVersion="10.10"
    //             />
    //         </item>
    //     })
    //
    //     let content = <rss xmlns__sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle"
    //                        xmlns__dc="http://purl.org/dc/elements/1.1/"
    //                        version="2.0">
    //         <channel>
    //             <title>Receipts App Changelog</title>
    //             <link>
    //                 {site.absoluteURL('sparklecast.xml')}
    //             </link>
    //             <description>Most recent changes with links to updates.</description>
    //             <language>en</language>
    //             {
    //                 downloadTexts[0]
    //             }
    //         </channel>
    //     </rss>
    //     // console.log('XML:', content)
    //     $.root().append(content)
    //     setXMLMode(false)
    //     return 'xml'
    // })
    //
    // // ---
    //
    // site.handle('track/ho_variables.php', content => {
    //     // console.log(content)
    //     return content.replace('0.0.0-placeholder', APP_VERSION)
    // })
    //
    // site.handle('php/page-latest.php', content => {
    //     console.log('Latest', DOWNLOAD_URL_DIRECT)
    //     return content.replace(/'\/download\/Receipts-latest.zip'/gi, '\'' + DOWNLOAD_URL_DIRECT + '\'')
    // })
    //
    // site.handle('changelog.html', $ => {
    //     $('#content').empty()
    //     $('link[hreflang]').remove()
    //     for (let release of DOWNLOADS) {
    //         $('#content').append(<div>
    //             <h3>
    //                 Version
    //                 {' '}
    //                 <a href={`/goto/download/${release.filename}`}>{release.version}</a>
    //             </h3>
    //             {
    //                 release.md
    //             }
    //         </div>)
    //         $('#content').append(<div>
    //             <hr/>
    //         </div>)
    //     }
    // })

}