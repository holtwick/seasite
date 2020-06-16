// (C)opyright 2017-12-13 Dirk Holtwick, holtwick.de. All rights reserved.
// @jsx jsx

import { server, Site } from 'seasite'

const TEMPLATE_PATH = 'template.html'

function main() {
  let site = new Site()
  site.handle(/\//, page => {
    page.html = 'found'
  })
  server(site)
}

main()
