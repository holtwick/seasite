'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setGA = setGA;
// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

// Support for Google Analytics integration, respecting do not track

function setGA($, key) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/

    $('body').append('<script> \nvar disableStr = \'ga-disable-' + key + '\';\n\nfunction gaOptout() {\n    document.cookie = disableStr + \'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/\';\n    window[disableStr] = true;\n    alert(\'Google Analytics tracking has been disabled.\');\n}\n\nif (!((window.navigator && window.navigator[\'doNotTrack\'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + \'=true\') !== -1))) {    \n    window.dataLayer = window.dataLayer || [];\n    function gtag(){ \n        dataLayer.push(arguments);\n    }\n    gtag(\'js\', new Date());\n    gtag(\'config\', \'' + key + '\', { \'anonymize_ip\': true });\n    document.write(\'<script async src="https://www.googletagmanager.com/gtag/js?id=' + key + '"></sc\'+\'ript>\');\n    console.log(\'Visit has been tracked by Google Analytics.\');\n} else {\n    console.log(\'Visit has NOT been tracked by Google Analytics.\');\n}\n</script>');
}