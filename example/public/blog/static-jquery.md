---
title: Static websites the jQuery way
date: 2017-12-30 16:00
keywords: jquery, website, static, cheerio, generator, nodejs, javascript, es6, seasite, server
tags: js, html, dev
---

**This blog and website consists of static pages created using a practical technique that I would like to introduce in this article.**

**Update 2018-02-15:** The project described here can be [downloaded from GitHub](https://github.com/holtwick/seasite) now.

The special thing about this is that a large part of this website generator consists of programming patterns, which are also used in dynamic websites via jQuery. A simple example says more than a thousand words:

```js
const site = SeaSite(
  'public',  	// Source folder
  'dist')		// Destination folder

site.handle('index.html', $ => {
  $('title').text('New Title')
})
```

This example creates the `site` object with the source directory `public` and the target directory `dist`. In the first step, the content of the source directory is cloned into the target directory. The next step is to edit the file `index.html`. The help function gets the variable `$` known from jQuery and sets the content of the `title` element to `New Title`. The modified content is saved automatically by the framework.

## File patterns and templating

From here it is easy to build more complex websites with a few lines of code:

```js
site.handle(/.*\.md/, (content, path) => {
   let $ = site.readDOM('template.html')
   let htmlPath = path.replace(/\.md$/, '.html')
   let md = parseMarkdown(content)
   let title = md.props.title
   $('title').text(`${title} - My Website`)
   $('#title').text(title)
   $('#content').html(md.html)
   site.write(htmlPath, $.html())
})
```

**template.html**:

```html
<!doctype html>
<head>
  <title>Template</title>
</head>
<body>
  <h1 id="title">Title</h1>
  <div id="content">
    Content
  </div>
</body>
```

**hello-world.md**:

```markdown
---
title: Hello World
---

Lorem **ipsum**
```

This example uses a **file pattern** to find all Markdown files in the site's source folder. As you may notice,  this time we get a plain string instead of the DOM object from the previous example. This is because DOM objects are only generated from `html` and `xml` files, otherwise a **string** is returned.

We then directly create a new DOM object from the  `template.html` file. There we set the content of the `title` element as well as for the DOM element with the ID `#title`. The title is extracted from the Markdown file, where we could put even more properties like e.g. language, description, keywords.

The Markdown parser "[marked](https://github.com/chjj/marked)" we use, converts the contents to an HTML string we can pass to the `#content` element in out template.

The last step is to write the file with a `.html` suffix. We don't need the Markdown files anymore and could clean up by calling `site.remove(/.*\.md/)`.

This little script will be applied to all Markdown files in the site's source folder, so you can quickly build up a site with easy to create content. The CSS selectors are super powerful and changing other aspects of the page is super simple and intuitive.

### Static JSX

But it doesn't stop here, let's push it a bit further! Lets use JSX to generate portions of HTML that need to be even more flexible. Let's imagine we want to create an index of all Markdown files we converted in the previous example:

```jsx
let pages = []

site.handle(/.*\.md/, (content, path) => {
  // ...
  pages.push({htmlPath, title})
}
            
site.handle('index.html', $ => {
  $('#content').html(
    <ul>
      {pages.map(page => <li><a href={page.htmlPath}>{title}</a></li>)}
    </ul>)
})
```

We enhanced the previous example by collecting page info in the `pages` variable. After all Markdown pages are processed the links should be added to the `index.html` file. We use JSX to create a simple list with links. This is the same code you would use in a React JS project, but of course this is a custom JSX generator, which creates an HTML string form the JSX code.

This way you don't need any complex templating language in the HTML file itself to get things done.

## The technology

All this is made possible by the awesome [cheerio]() project, which is driving the DOM and jQuery like part. The API is covering everything you'll need to manipulate the HTML and XML files.

The rest is mostly custom code which I'll be happy to open source if there is interest. Drop me a line via the [support form](../support.html) or at [Twitter](https://twitter.com/holtwick).



