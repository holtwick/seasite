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

// (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx

import { jsx } from '../site/jsx'
import { html } from '../site/dom'
import { matomoAnalytics, matomoCampaignURL, matomoPixelImage } from './matomo'

describe('pugin.matomo', () => {

  const matomo = {
    url: 'https://stats.holtwick.de/matomo/',
    id: 2,
  }

  it('should update a campaign url', () => {
    let url = matomoCampaignURL('https://www.receipts-app.com/de/help?me#now', {
      name: 'campaign1',
      kw: 'keyword1',
    })
    expect(url).toEqual('https://www.receipts-app.com/de/help?me=&pk_campaign=campaign1&pk_kwd=keyword1#now')
  })

  it('should create a count pixel', () => {
    let html = matomoPixelImage({
      matomo,
      url: '/rss-opened',
    })
    expect(html).toEqual('<img src="https://stats.holtwick.de/matomo/matomo.php?idsite=2&amp;rec=1&amp;bots=1&amp;url=%2Frss-opened&amp;_rcn=blog" style="border:0;" alt>')
  })

  it('should add to page', () => {
    const sample = <body>Test</body>
    let $ = html(sample)
    $.applyPlugins([matomoAnalytics(matomo)])
    expect($.markup()).toBe(`<!doctype html>
<html><head></head><body>Test<script>
var disableStr = 'ga-disable-2';

function gaOptout() {
  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
  window[disableStr] = true;
  alert('Tracking has been disabled.');
}

if (!((window.navigator && window.navigator['doNotTrack'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + '=true') !== -1))) {    
  var _paq = window._paq || []; 
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://stats.holtwick.de/matomo/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '2']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
} 
</script><noscript><img src="https://stats.holtwick.de/matomo/matomo.php?idsite=2&amp;rec=1" style="border:0;" alt=""></noscript></body></html>`)
  })

})
