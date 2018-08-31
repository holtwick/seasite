"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.googleAnalytics = googleAnalytics;

var _log = _interopRequireDefault(require("../log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// Support for Google Analytics integration, respecting do not track
function googleAnalytics(key) {
  return function ($) {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/
    // Avoid document.write https://developers.google.com/web/tools/lighthouse/audits/document-write
    _log.default.assert(key, '[plugin.ga] key required');

    $('body').append("<script> \nvar disableStr = 'ga-disable-".concat(key, "';\n\nfunction gaOptout() {\n    document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';\n    window[disableStr] = true;\n    alert('Google Analytics tracking has been disabled.');\n}\n\nif (!((window.navigator && window.navigator['doNotTrack'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + '=true') !== -1))) {    \n    window.dataLayer = window.dataLayer || [];\n    function gtag(){ \n        dataLayer.push(arguments);\n    }\n    gtag('js', new Date());\n    gtag('config', '").concat(key, "', { 'anonymize_ip': true });\n    \n    var script = document.createElement('script');\n    script.setAttribute('async', 'async');\n    script.setAttribute('src', \"https://www.googletagmanager.com/gtag/js?id=").concat(key, "\")\n    document.body.appendChild(script)\n\n    console.log('Visit has been tracked by Google Analytics.');\n} else {\n    console.log('Visit has NOT been tracked by Google Analytics.');\n}\n</script>"));
  };
}