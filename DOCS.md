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

## Basic Concepts

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

### Paths {#paths}

For the following features it is important to understand what `path` refers to. So after the instantiation of `SeaSite` all work is happening on the copy in the destination folder. A path like `index.html` will than map to `dist/index.html` in our previous example. **Todo: Slash requirements?!**

### Patterns {#patterns}

The **path pattern** (referred to as `pattern`) that is used in some of the following methods, can be either a simple string representing the full path, like `contact/index.html` or a regular expression like `.*\.md` which would retrieve all Markdown files, even those in sub directories. The last option is to pass an `Array` with a list of strings or regular expressions as described before.

### DOM {#dom}

The real magic is in the jQuery like manipulation of the contents. [Cheerio](https://cheerio.js.org) is used to provide the functionality. In SeaSite the `dom()` helper converts input like strings to a jQuery like DOM environment. It also adds some more functionalities, like support for [plugins](#plugins).

```jsx
let $ = dom('<b>Hello World</b>')
$(b).text('Hallo Welt')
expect($.html()).toEqual('<b>Hallo Welt</b>')
```

## Site {#site}

### site.handle(pattern, fn)

Make all files matching `pattern` go through `fn`. For HTML and XML files the parameters of `fn` will be `dom` and `path` otherwise just the content. Example:

```js
site.handle(/.*\.html/, ($, path) => {
    $('title').text(path)
})
```

Usually the DOM is manipulated and written back to replace the source file. You can also return a `string` to be written as the file content.

In case no file should be written at all, return `false`.

For more flexibility you can also return an object describing details about the output. The available properties:

- `path`: The new destination path
- `content`: Override the `$` and use this as the file's content. It can be of type DOM or string
- `mode`: The mode which should be used to write out the DOM, default is `html` but also `xml` is supported.
- `ignore`: Set to `true` is the same as returning `false`.

An example:

```js
site.handle('/en/help', $ => {
    $.applyPlugins([plugin.localize({
        lang: 'de'
    })])
    return {
        path: '/de/help'
    }
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

Returns all paths that match `pattern`. Optionally matches can be excluded via `excludePattern`. Set [patterns](#patterns) section to learn more about which patterns are supported.

### site.url(path):url

Converts a path to a local url with leading `/`.

### site.publicURL(path):url {#publicURL}

Convert a `path` to a public URL that you e.g. would like to see as the canonical URL or in the sitemap. This should usually also include the scheme and host name. Example: `https://example.com/contact`

### site.copyNPM(module, relativePath, toSitePath)

Copies subfolder of an NPM module into the site's public space. This can be useful to always get the latest `jquery` etc via NPM instead of getting it manually. Example:

```js
site.copyNOPM('jquery', 'dist', 'js/jquery')
```

### site.log

The logger used by `site`. Example:

```js
site.log.info('Start')
site.log.warn('Missing', missing)
```

## Tasks {#tasks}

These are solutions for common tasks. The first parameter is

```js
import task from `seasite`
```

### task.handle(site, options)  {#taskhandle}

Walk through all files.

Options:

- `pattern`: [Patterns](#patterns) to be included
- `exclude`: [Patterns](#patterns) to be excluded
- `plugins`: Plugins to be applied if file is DOM compatible
- `handler($, path)`: Will be called for each HTML file handled and not excluded.

### task.html(site, options)

Walk through all HTML files.

Options:

- `pattern`: [Patterns](#patterns) to be included. Preset to filter files ending on `.html` or `.htm`
- `exclude`: [Patterns](#patterns) to be excluded

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

### plugin.href(opt) {#plugin.href}

Normalize links to the needs of the current site.

- `relative` will transform links to be relative to the basePath of the current file
- `handleURL(url)` allows final modifications for the resulting URL like stripping the `.html` part etc. 
- `ignore`: Regular expression

### plugin.img(opt) {#plugin.img}

Requires `opt.site` or `opt.basePath` to know about the base folder of the site. Optionally  `opt.path` can be passed to resolve relative links.

The plugin collects all `img` elements and checks if the referred `src` file does exists. If `width` and `height` are missing, `width` will be set from the original image file. If the file name contains `@2x.` the half sizes will be used.

If the `img` element is the only child of a `p` element, the class `img-wrapped` will be added to the `p` element.

**Todo:** Fill `srcset` with appropriate info.

### plugin.localize(opt) 

This helps to translate a page to a different language easily. Lets go with German `opt.lang = 'de'` in this example. 

You can provide the translation strings in a JSON file you put in the `languages` folder (in out example `languages/de.json`) or by setting `opt.string` to a dictionary mapping each source string to its translation:

```json
{
    "Hello World": "Hallo Welt",
    "/en/hello": "/de/hello"
}
```

Now in the HTML you can prepend any attribute or text with one or two `_` to mark it for translation:

```html
<a href="_/en/hello">_Hello World</a>
```

For debugging purposes missing strings can be collected:

```js
let missing = {}

doSomethingWithPlugin(
    plugin.localized({
    	lang: 'de',
	    missing
	})
)

console.log('These strings are missing:', 
            JSON.stringify(missing, null, 2))
```

### plugin.youtube(opt)

Streamlines embedded Youtube videos and adds an overlay. The embedded video will only be inserted after the user clicked the play button. This results in faster page loading and better privacy experience.

### plugin.disqus(opt)

Commenting provided by [disqus.com](https://disqus.com). The integration is done lazily i.e. user first needs to confirm before actuel 3rd party code is loaded.

- `selector` defining the containers where the code should be added to (Default `.disqus`)
- `disqusURL` is the JS code URL provided by disqus to be used [for embedding](https://disqus.com/admin/install/platforms/universalcode/) 

### More Plugins

To be documented:

- plugin.href()
- plugin.tidy()

## Appendix

### License

The project is licensed under AGPLv3. If you need a commercial license, please get in [contact with me](https://holtwick.de/support).