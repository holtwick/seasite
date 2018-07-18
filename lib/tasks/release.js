'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.release = release;

var _index = require('../index');

var _site = require('../site');

var _jsx = require('../site/jsx');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// interface ReleaseInfo {
//     version: string,
//     build: string,
//     downloadPath: string,
//     content: string
// }

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

var defaults = {
    folder: 'blog',
    pattern: null
};

function release(site) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    opt = Object.assign({}, defaults, opt);

    if (!opt.pattern && opt.folder) {
        opt.pattern = new RegExp(opt.folder + '\/.*\.zip$');
    }

    var entries = site.paths(opt.pattern).filter(function (p) {
        return (/\.\d+(-\d+)?\.zip$/.test(p)
        );
    }).map(function (path) {
        var r = /(^.+)((\d+)\.(\d+)\.(\d+)(\.(\d+))?)(-(\d+))?\.[^\.]+$/.exec(path);

        var prefix = r[1];
        var version = r[2];
        var major = +r[3] || 0;
        var minor = +r[4] || 0;
        var patch = +r[5] || 0;
        var fix = +r[7] || 0;
        var build = +r[9] || 0;

        var descPath = '' + prefix + version + '.md';
        if ((0, _fs.existsSync)(site.path(descPath))) {
            // const md = readMarkdown(pp)
            // if (md) {
            // console.log(pp, md);

            var stat = (0, _fs.statSync)(site.path(path)) || {};
            return {
                date: stat.mtime, // creation time
                major: major,
                minor: minor,
                patch: patch,
                fix: fix,
                version: version,
                build: build,
                // md,
                path: path,
                prefix: prefix,
                descPath: descPath
            };
        }
    }).filter(function (o) {
        return !!o;
    }) // exclude empty ones
    .sort(function (a, b) {
        // by build and version numbers
        var r = void 0;
        r = a.build - b.build;
        if (r === 0) {
            r = a.major - b.major;
            if (r === 0) {
                r = a.minor - b.minor;
                if (r === 0) {
                    r = a.patch - b.patch;
                    if (r === 0) {
                        r = a.fix - b.fix;
                    }
                }
            }
        }
        return r;
    }).reverse();

    return entries;

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