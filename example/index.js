// (C)opyright 2017-12-13 Dirk Holtwick, holtwick.de. All rights reserved.
// @jsx jsx

import dateformat from 'dateformat'

import {
    SeaSite,
    jsx,
    dom,
    task,
    plugin,
    HTML,
} from 'seasite'

const WEBSITE_PUBLIC_URL = 'https://holtwick.github.io/seasite-website'
const TEMPLATE_PATH = 'template.html'

function main() {

    function handleURL(url) {
        if (url.indexOf('/seasite-website/') !== 0) {
            url = '/seasite-website' + url
        }
        return url
        // return url
        //     .replace(/\.html$/, '')
        //     .replace(/\/index$/, '/')
    }

    let site = new SeaSite(
        'public',
        'dist', {
            includePatterns: [
                /^(\.htaccess|[^.].*)$/,
            ],
            excludePatterns: [],
            baseURL: WEBSITE_PUBLIC_URL,
            publicURL(path) {
                return WEBSITE_PUBLIC_URL + handleURL(path)
            },
        })

    // const templatePlugins = [
    //     plugin.href(),
    // ]

    const $ = dom(site.read(TEMPLATE_PATH))
    $.applyPlugins([
        plugin.href(),
    ])
    const templateHTML = $.html()

    function template(site) {
        return dom(templateHTML)
    }

    // Helper

    let posts = task.blog(site, {
        title: 'Blog',
        url: WEBSITE_PUBLIC_URL,
        description: 'Blog of Dirk Holtwick',
        copyright: 'Dirk Holtwick',
        author: 'Dirk Holtwick',
        language: 'en-en',
        template,
    })

    function pathToHTMLPath(path) {
        return path.replace(/\..+?$/, '.html').replace(/\/-/, '/')
    }

    task.markdown(site, {
        group: 'blog',
        template,
        handle($, opt) {
            // let group = opt.group || 'blog'
            $(`li[data-group="${opt.group}"]`).addClass('active')

            // Related pages, go to bottom of page
            let related = (opt.related || '').trim().split(',').map(v => v.trim()).filter(v => !!v)

            // The main body content
            $('#content').html(<div>

                <h1 className="blog-post-title">{opt.title}</h1>

                {opt.group === 'blog' &&
                <p className="blog-post-meta">{dateformat(opt.date, 'longDate')}</p>
                }

                {HTML(opt.html)}

                {related.length > 0 &&
                <div className="blog-post-related">
                    <h4>Related Posts</h4>
                    <ul>
                        {related.map(r => <li><a href={`${r}.html`}>{r}</a></li>)}
                    </ul>
                </div>

                }
            </div>)

            // Right sidebar
            if (opt.outline) {
                $('#sidebar').html(
                    <nav id="outline" className="bs-docs-sidebar hidden-print hidden-sm hidden-xs" data-spy="affix"
                         data-offset-top="68">
                        {HTML(opt.outline)}
                        <a href="#top" className="back-to-top"> Back to top </a>
                    </nav>,
                )
                $('body').attr('data-spy', 'scroll').attr('data-target', '#outline')
                $('#content').addClass('doc')
            }
            else if (opt.group === 'blog' || opt.group === 'index') {
                let well = [], ct = 3
                for (let post of posts) {
                    if (ct <= 0) break
                    if (post.path !== opt.path) {
                        well.push(<li>
                            {dateformat(post.date, 'longDate')}<br/>
                            <a href={site.url(pathToHTMLPath(post.path))}>
                                {post.title}
                            </a>
                        </li>)
                        --ct
                    }
                }
                $('#recent-posts').html(well.join(''))
            }
            else {
                $('#recent-posts-container').remove()
            }
        },
    })

    // Remove some files
    site.remove(/.*\.md$/)
    site.remove('template.html')

    // A last walkthrough
    let plugins = [
        plugin.googleAnalytics('UA-261158-1'),
        plugin.meta({
            lang: 'en',
            twitter: 'holtwick',
        }),
        plugin.href({
            // handleURL,
            relative: true,
        }),
        plugin.bestPractice(),
        plugin.tidy(),
    ]

    task.html(site, {
        handler($, path) {
            let url = site.publicURL(path)
            let title = $('title').text()
            title = `SeaSite - ${title}`
            $.applyPlugins(plugins, {
                path,
                url,
                title,
            })
        },
    })

    task.sitemap(site, {
        exclude: [
            '404.html',
            TEMPLATE_PATH,
        ],
    })
}

main()
