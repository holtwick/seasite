// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

// Support for Google Analytics integration, respecting do not track

export function setGA($, key) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/

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
    document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=${key}"></sc'+'ript>');
    console.log('Visit has been tracked by Google Analytics.');
} else {
    console.log('Visit has NOT been tracked by Google Analytics.');
}
</script>`)
}
