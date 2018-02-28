---
group: docs
outline: true 
---

# Documentation of "SeaSite"

*Author: Dirk Holtwick, [holtwick.de](https://holtwick.de)*

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

### site.handle(pattern, fn)

Make all files matching `pattern` go through `fn`. For HTML and XML files the parameters of `fn` will be `dom` and `path` otherwise just the content. Example:

```js
site.handle(/.*\.html/, ($, path) => {
    $('title').text(path)
})
```



### site.copy(from, to)

Copy file.

### site.move(from, to)

Move file.

### site.remove(pattern)

Remove files.

### site.read(path)

Read file at `path`. Result is of type Buffer.

### site.write(path, data)

Writes `data` to `path` overwriting existing files without asking for confirmation. `data` can be of type String, Buffer or [DOM](#dom).

### site.paths(pattern):paths

Returns all paths that match `pattern`

### site.url(path):url

Converts a path to a local url with leading `/`.

### site.publicURL(path):url {#publicURL}

Convert a `path` to a public URL that you e.g. would like to see as the canonical URL or in the sitemap. This should usually also include the scheme and host name. Example: `https://example.com/contact`

## DOM {#dom}

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

### task.blog(site, options)

```js
task.blog(site, {
    template(site) {
        return site.read('blog/template.html')
    }
})
```

### task.markdown(site, options)

Converts all Markdown files ending on `.md` to HTML files. You can mix in templates and custom handlers.

### task.sitemap(site, options)

Creates a `sitemap.txt` file. Should be called after all other tasks are completed and templates etc. are removed. Can also be used to apply plugins to all HTML files, as a final step.

Options:

- `exclude`: List of patterns to exclude. Strings also match if they are at the beginning. For example `['private/']` will exclude all files in folder `private`
- `handler($, path)`: Will be called for each HTML file handled and not excluded.

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

Make some changes to fit Google Lighthouse *best practice tests* better.

### plugin.googleAnalytics(key)

Add JS snippet that calls Google Analytics. It will respect *do not track* settings of the browser. Also supports *opt out*.

### plugin.meta(opt)

Apply various `meta` tags to improve SEO quality. TBD.

## Appendix

### License

The project is licensed under GPLv3. If you need a commercial license, please get in [contact with me](https://holtwick.de/support).