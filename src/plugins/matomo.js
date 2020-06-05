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

// @flow
// @jsx jsx

import log from '../log'
import { jsx } from '../site/jsx'

// Support for Matomo integration, respecting do not track

export function matomoCampaignURL(url, opt = {}) {
  const {
    name = 'blog',
    kw = '',
    source = '',
  } = opt
  log.assert(url, '[plugin.matomo] url required')
  let href = new URL(url)
  name && href.searchParams.set('pk_campaign', name)
  kw && href.searchParams.set('pk_kwd', kw)
  source && href.searchParams.set('pk_source', source)
  return href.toString()
}

export function matomoPixelImage(opt) {
  const {
    matomo,
    url,
    action,
    name = 'blog',
    kw = '',
  } = opt
  log.assert(matomo.id, '[plugin.matomo] matomo.id required')
  log.assert(matomo.url, '[plugin.matomo] matomo.url required')
  log.assert(url, '[plugin.matomo] url required')
  let href = new URL(matomo.url + 'matomo.php')
  href.searchParams.set('idsite', matomo.id.toString())
  href.searchParams.set('rec', '1')
  href.searchParams.set('bots', '1')
  href.searchParams.set('url', url)
  action && href.searchParams.set('action_name', action)
  name && href.searchParams.set('_rcn', name) // Campaign name
  kw && href.searchParams.set('_rck', kw) // Campaign keyword
  return <img src={href.toString()} style="border:0;" alt=""/>
}

export function matomoAnalytics(opt: Object) {
  let { url, id } = opt || {}
  return ($: Function) => {
    log.assert(url, '[plugin.matomo] url required')
    log.assert(id, '[plugin.matomo] id required')

    $('body').append(`<script>
var disableStr = 'ga-disable-${id}';

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
    var u="${url}";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '${id}']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
} 
</script> 
<noscript><p><img src="${url}matomo.php?idsite=${id}&amp;rec=1" style="border:0;" alt=""></p></noscript>`)
  }
}
