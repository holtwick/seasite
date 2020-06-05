"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matomoCampaignURL = matomoCampaignURL;
exports.matomoPixelImage = matomoPixelImage;
exports.matomoAnalytics = matomoAnalytics;

var _log = _interopRequireDefault(require("../log"));

var _jsx = require("../site/jsx");

function matomoCampaignURL(url) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opt$name = opt.name,
      name = _opt$name === void 0 ? 'blog' : _opt$name,
      _opt$kw = opt.kw,
      kw = _opt$kw === void 0 ? '' : _opt$kw,
      _opt$source = opt.source,
      source = _opt$source === void 0 ? '' : _opt$source;

  _log["default"].assert(url, '[plugin.matomo] url required');

  var href = new URL(url);
  name && href.searchParams.set('pk_campaign', name);
  kw && href.searchParams.set('pk_kwd', kw);
  source && href.searchParams.set('pk_source', source);
  return href.toString();
}

function matomoPixelImage(opt) {
  var matomo = opt.matomo,
      url = opt.url,
      action = opt.action,
      _opt$name2 = opt.name,
      name = _opt$name2 === void 0 ? 'blog' : _opt$name2,
      _opt$kw2 = opt.kw,
      kw = _opt$kw2 === void 0 ? '' : _opt$kw2;

  _log["default"].assert(matomo.id, '[plugin.matomo] matomo.id required');

  _log["default"].assert(matomo.url, '[plugin.matomo] matomo.url required');

  _log["default"].assert(url, '[plugin.matomo] url required');

  var href = new URL(matomo.url + 'matomo.php');
  href.searchParams.set('idsite', matomo.id.toString());
  href.searchParams.set('rec', '1');
  href.searchParams.set('bots', '1');
  href.searchParams.set('url', url);
  action && href.searchParams.set('action_name', action);
  name && href.searchParams.set('_rcn', name);
  kw && href.searchParams.set('_rck', kw);
  return (0, _jsx.jsx)("img", {
    src: href.toString(),
    style: "border:0;",
    alt: ""
  });
}

function matomoAnalytics(opt) {
  var _ref = opt || {},
      url = _ref.url,
      id = _ref.id;

  return function ($) {
    _log["default"].assert(url, '[plugin.matomo] url required');

    _log["default"].assert(id, '[plugin.matomo] id required');

    $('body').append("<script>\nvar disableStr = 'ga-disable-".concat(id, "';\n\nfunction gaOptout() {\n  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';\n  window[disableStr] = true;\n  alert('Tracking has been disabled.');\n}\n\nif (!((window.navigator && window.navigator['doNotTrack'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + '=true') !== -1))) {    \n  var _paq = window._paq || []; \n  _paq.push(['trackPageView']);\n  _paq.push(['enableLinkTracking']);\n  (function() {\n    var u=\"").concat(url, "\";\n    _paq.push(['setTrackerUrl', u+'matomo.php']);\n    _paq.push(['setSiteId', '").concat(id, "']);\n    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);\n  })();\n} \n</script><noscript><img src=\"").concat(url, "matomo.php?idsite=").concat(id, "&amp;rec=1\" style=\"border:0;\" alt=\"\"></noscript>"));
  };
}