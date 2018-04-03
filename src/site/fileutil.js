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

import path from 'path'
import fs from 'fs'

export function walkSync(rootFolder, subFolder = '', ignoreHidden = true) {
    let resultPaths = []
    let paths = fs.readdirSync(path.join(rootFolder, subFolder))
    if (paths != null && paths.length > 0) {
        for (let file of paths) {
            // if (!ignoreHidden || file[0] !== '.') {
            file = path.join(subFolder, file)
            let realFile = path.join(rootFolder, file)
            let stat = fs.statSync(realFile)
            if (stat && stat.isDirectory()) {
                resultPaths = resultPaths.concat(walkSync(rootFolder, file) || [])
            } else {
                resultPaths.push(file)
            }
            // }
        }
    }
    return resultPaths
}

export function rmdir(dir) {
    try {
        let list = fs.readdirSync(dir)
        for (let i = 0; i < list.length; i++) {
            let filename = path.join(dir, list[i])
            let stat = fs.statSync(filename)
            if (filename === '.' || filename === '..') {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename)
            } else {
                // rm filename
                fs.unlinkSync(filename)
            }
        }
        fs.rmdirSync(dir)
    } catch (ex) {

    }
}

export function mkdir(p, root = '') {
    let dirs = p.split(path.sep)
    let dir = dirs.shift()
    root = (root || '') + dir + path.sep
    try {
        fs.mkdirSync(root, 0o755)
    }
    catch (ex) {
        //dir wasn't made, something went wrong
        if (!fs.statSync(root).isDirectory()) {
            throw new Error(ex)
        }
    }
    return !dirs.length || mkdir(dirs.join(path.sep), root)
}
