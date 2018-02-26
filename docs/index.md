# Documentation of "SeaSite"

> Author: Dirk Holtwick, [holtwick.de](https://holtwick.de)

## Introduction

The purpose of SeaSite is to provide an **easy** and **cross platform consistent** way to **create websites**. This is achieved by using common HTML and Javascript techniques, that are similar to those used for dynamic web pages.

It all started with my own websites and an article I wrote in my blog about the technique I used: <https://holtwick.de/blog/static-jquery>

## Getting Started

The easiest way to get started is to install SeaSite globally:

```sh
npm install seasite -g
```

This will install a command line tool called `seasite` that you can now use to setup a project in an empty folder:

```sh
seasite init
npm install
```

The following command will create the site in the folder `dist`:

```sh
npm start
```

## Site

The central piece of the engine is the `SeaSite` object. In the most simple setup a source and a destination folder will be defined. The first action that will happen is to close the destination to the source folder. All following actions will operate on this clone.

```js
import {SeaSite} from 'seasite'

let site = new SeaSite(
        'public',  // Source
        'dist')    // Destination
```

The third parameter will hold options:

- `baseURL`
- `publicURL(path)`: Override for [`site.publicURL()`](#publicURL)

The **path pattern** (referred to as `pattern`) that is used in some of the following methods, can be either a simple string representing the full path, like `contact/index.html` or a regular expression like `.*\.md` which would retrieve all Markdown files, even those in sub directories. The last option is to pass an `Array` with string representations described before.

### site.handle(pattern)

xxx

### site.copy(from, to)

xxx

### site.move(from, to)

xxx

### site.remove(pattern)

xxx

### site.read(path)

xxx

### site.write(path)

xxx

### site.paths(pattern):patterns

xxx

### site.publicURL(path):url {#publicURL}

Convert a `path` to a public URL that you e.g. would like to see as the canonical URL or in the sitemap. This should usually also include the scheme and host name. Example: `https://example.com/contact`

## DOM

The real magic is in the jQuery like manipulation of the contents. `Cheerio` is used to provide the functionality. In SeaSite the `dom()` helper converts input like strings to a jQuery like DOM environment. It also adds some more functionalities, like support for [plugins](#plugins).

```jsx
let $ = dom('<b>Hello World</b>')
$(b).text('Hallo Welt')
expect($.html()).toEqual('<b>Hallo Welt</b>')
```

## Tasks {#tasks}

These are solutions for common tasks. The first parameter is

```js
import task from `seasite`
```

### task.blog(site, opt)

```js
task.blog(site, {
    template(site) {
        return site.read('blog/template.html')
    }
})
```

### task.sitemap(site)

xxx

## Plugins {#plugins}

Plugins perform changes on a DOM object. They can be reused. Example:

```js
import plugin from 'seasite'

const plugins = [
    plugin.meta({
        twitter: '@holtwick'
    }),
    plugin.bestPractice()
]

$.applyPlugins(plugins, {
    title: 'Hello World'
})
```

### plugin.bestPractice()

xxx

### plugin.googleAnalytics(key)

xxx

### plugin.meta(opt)

xxx

## Appendix

### License

The project is licensed under GPLv3. If you need a commercial license, please get in [contact with me](https://holtwick.de/support).