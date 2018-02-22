'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setGA = setGA;
// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

// Support for Google Analytics integration, respecting do not track

function setGA($, key) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/
    // Avoid document.write https://developers.google.com/web/tools/lighthouse/audits/document-write

    $('body').append('<script> \nvar disableStr = \'ga-disable-' + key + '\';\n\nfunction gaOptout() {\n    document.cookie = disableStr + \'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/\';\n    window[disableStr] = true;\n    alert(\'Google Analytics tracking has been disabled.\');\n}\n\nif (!((window.navigator && window.navigator[\'doNotTrack\'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + \'=true\') !== -1))) {    \n    window.dataLayer = window.dataLayer || [];\n    function gtag(){ \n        dataLayer.push(arguments);\n    }\n    gtag(\'js\', new Date());\n    gtag(\'config\', \'' + key + '\', { \'anonymize_ip\': true });\n    \n    var script = document.createElement(\'script\');\n    script.setAttribute(\'async\', \'async\');\n    script.setAttribute(\'src\', "https://www.googletagmanager.com/gtag/js?id=' + key + '")\n    document.body.appendChild(script)\n\n    console.log(\'Visit has been tracked by Google Analytics.\');\n} else {\n    console.log(\'Visit has NOT been tracked by Google Analytics.\');\n}\n</script>');
}