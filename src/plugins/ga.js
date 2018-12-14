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

import log from '../log'

// Support for Google Analytics integration, respecting do not track

export function googleAnalytics(key: string) {
  return ($: Function) => {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/
    // Avoid document.write https://developers.google.com/web/tools/lighthouse/audits/document-write

    log.assert(key, '[plugin.ga] key required')

    $('body').append(`<script> 
var disableStr = 'ga-disable-${key}';

function gaOptout() {
    document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    window[disableStr] = true;
    alert('Google Analytics tracking has been disabled.');
}

if (!((window.navigator && window.navigator['doNotTrack'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + '=true') !== -1))) {    
    window.dataLayer = window.dataLayer || [];
    function gtag(){ 
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${key}', { 'anonymize_ip': true });
    
    var script = document.createElement('script');
    script.setAttribute('async', 'async');
    script.setAttribute('defer', 'defer');
    script.setAttribute('src', "https://www.googletagmanager.com/gtag/js?id=${key}")
    document.body.appendChild(script)

    console.log('Visit has been tracked by Google Analytics.');
} else {
    console.log('Visit has NOT been tracked by Google Analytics.');
}
</script>`)
  }
}