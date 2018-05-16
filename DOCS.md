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

### Paths

For the following features it is important to understand what `path` refers to. So after the instantiation of `SeaSite` all work is happening on the copy in the destination folder. A path like `index.html` will than map to `dist/index.html` in our previous example. **Todo: Slash requirements?!**

### Patterns

The **path pattern** (referred to as `pattern`) that is used in some of the following methods, can be either a simple string representing the full path, like `contact/index.html` or a regular expression like `.*\.md` which would retrieve all Markdown files, even those in sub directories. The last option is to pass an `Array` with a list of strings or regular expressions as described before.

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

### site.paths(pattern, excludePattern):paths

Returns all paths that match `pattern`. Optionally matches can be excluded via `excludePattern`.

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

### task.handle(site, options)  {#taskhandle}

Walk through all files.

Options:

- `pattern`: Patterns to be included
- `exclude`: Patterns to be excluded
- `plugins`: Plugins to be applied if file is DOM compatible
- `handler($, path)`: Will be called for each HTML file handled and not excluded.

### task.html(site, options)

Walk through all HTML files.

Options:

- `pattern`: Pattern is preset to filter files ending on `.html` or `.htm`
- Other options as in [task.handle()](#taskhandle)

### task.markdown(site, options)

Converts all Markdown files ending on `.md` to HTML files. You can mix in templates and custom handlers.

### task.blog(site, options)

```js
task.blog(site, {
    template(site) {
        return site.read('blog/template.html')
    }
})
```

### task.sitemap(site, options)

Creates a `sitemap.txt` file. Should be called after all other tasks are completed and templates etc. are removed. 

Options:

- `exclude`: List of patterns to exclude. Strings also match if they are at the beginning. For example `['private/']` will exclude all files in folder `private`

  ​

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

Make some changes to fit **[Google Lighthouse](https://developers.google.com/web/tools/lighthouse)** *best practice tests* better.

- `<a target="_blank">` will receive `rel=noopener` attribute. [More.](https://developers.google.com/web/tools/lighthouse/audits/noopener)

### plugin.googleAnalytics(key)

Add JS snippet that calls Google Analytics. It will respect *do not track* settings of the browser. Also supports *opt out*.

### plugin.meta(opt)

Apply various `meta` tags to improve SEO quality. TBD.

- `title` will set `<title>` and `<meta og:title>`
- ...

### plugin.img(opt) {#plugin.img}

Requires `opt.site` or `opt.basePath` to know about the base folder of the site. Optionally  `opt.path` can be passed to resolve relative links.

The plugin collects all `img` elements and checks if the referred `src` file does exists. If `width` and `height` are missing, `width` will be set from the original image file. If the file name contains `@2x.` the half sizes will be used.

If the `img` element is the only child of a `p` element, the class `img-wrapped` will be added to the `p` element.

**Todo:** Fill `srcset` with appropriate info.

### plugin.youtube(opt)

Streamlines embedded Youtube videos and adds an overlay. The embedded video will only be inserted after the user clicked the play button. This results in faster page loading and better privacy experience.

### More Plugins

To be documented:

- plugin.href()
- plugin.tidy()

## Appendix

### License

The project is licensed under GPLv3. If you need a commercial license, please get in [contact with me](https://holtwick.de/support).