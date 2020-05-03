"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matomoAnalytics = matomoAnalytics;

var _log = _interopRequireDefault(require("../log"));

function matomoAnalytics(opt) {
  var _ref = opt || {},
      url = _ref.url,
      id = _ref.id;

  return function ($) {
    _log["default"].assert(url, '[plugin.matomo] url required');

    _log["default"].assert(id, '[plugin.matomo] id required');

    $('body').append("<script>\nvar disableStr = 'ga-disable-".concat(id, "';\n\nfunction gaOptout() {\n  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';\n  window[disableStr] = true;\n  alert('Tracking has been disabled.');\n}\n\nif (!((window.navigator && window.navigator['doNotTrack'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + '=true') !== -1))) {    \n  var _paq = window._paq || []; \n  _paq.push(['trackPageView']);\n  _paq.push(['enableLinkTracking']);\n  (function() {\n    var u=\"").concat(url, "\";\n    _paq.push(['setTrackerUrl', u+'matomo.php']);\n    _paq.push(['setSiteId', '").concat(id, "']);\n    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);\n  })();\n} \n</script>"));
  };
}