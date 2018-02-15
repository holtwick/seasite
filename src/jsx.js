// (C)opyright Dirk Holtwick, 2016-08-20 <dirk.holtwick@gmail.com>

// Special cases:
// 1. <noop> is an element that is not printed out, can be used to create a list of elements
// 2. Attribute name '__' gets transformed to ':' for namespace emulation
// 3. Emulate CDATA by <cdata> element

export function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

let USED_JSX = [] // HACK:dholtwick:2016-08-23
var __xmlMode = false // HACK:2017-12-29

export function CDATA(s) {
    s = '<![CDATA[' + s + ']]>'
    USED_JSX.push(s)
    return s
}

export function HTML(s) {
    USED_JSX.push(s)
    return s
}

export function prependXMLIdentifier(s) {
    return '<?xml version="1.0" encoding="utf-8"?>\n' + s
}

export function jsx(tag, attrs, ...children) {
    let s = ''
    if (tag !== 'noop') {
        if (tag !== 'cdata') {
            s += `<${tag}`
        } else {
            s += '<![CDATA['
        }

        // Add attributes
        for (let name in attrs) {
            if (name && attrs.hasOwnProperty(name)) {
                let v = attrs[name]
                if (name.toLowerCase() === 'classname') {
                    name = 'class'
                }
                name = name.replace(/__/g, ':')
                if (v === true) {
                    s += ` ${name}="${name}"`
                } else if (name === 'style' && typeof v === 'object') {
                    s += ` ${name}="${
                        Object.keys(v).filter(
                            k => v[k] != null,
                        ).map(
                            k => {
                                let vv = v[k]
                                vv = typeof vv === 'number' ? vv + 'px' : vv
                                return `${k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${vv}`
                            }).join(';')
                        }"`
                } else if (v !== false && v != null) {
                    s += ` ${name}="${escapeHTML(v.toString())}"`
                }
            }
        }
        if (tag !== 'cdata') {
            s += `>`
        }

        if (!__xmlMode) {
            if (['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'].indexOf(tag) !== -1) {
                USED_JSX.push(s)
                return s
            }
        }
    }

    // Append children
    for (let child of children) {
        if (child != null && child !== false) {
            if (!Array.isArray(child)) {
                child = [child]
            }
            for (let c of child) {
                if (USED_JSX.indexOf(c) !== -1) {
                    s += c
                } else {
                    s += escapeHTML(c.toString())
                }
            }
        }
    }

    if (tag !== 'noop') {
        if (tag !== 'cdata') {
            s += `</${tag}>`
        } else {
            s += ']]>'
        }
    }
    USED_JSX.push(s)
    return s
}

// HACK:2017-12-29
export function setXMLMode(value) {
    __xmlMode = value
}
