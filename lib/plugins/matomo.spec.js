"use strict";

var _jsx = require("../site/jsx");

var _dom = require("../site/dom");

var _matomo = require("./matomo");

describe('pugin.matomo', function () {
  var matomo = {
    url: 'https://stats.holtwick.de/matomo/',
    id: 2
  };
  it('should update a campaign url', function () {
    var url = (0, _matomo.matomoCampaignURL)('https://www.receipts-app.com/de/help?me#now', {
      name: 'campaign1',
      kw: 'keyword1'
    });
    expect(url).toEqual('https://www.receipts-app.com/de/help?me=&pk_campaign=campaign1&pk_kwd=keyword1#now');
  });
  it('should create a count pixel', function () {
    var html = (0, _matomo.matomoPixelImage)({
      matomo: matomo,
      url: '/rss-opened'
    });
    expect(html).toEqual('<img src="https://stats.holtwick.de/matomo/matomo.php?idsite=2&amp;rec=1&amp;bots=1&amp;url=%2Frss-opened&amp;_rcn=blog" style="border:0;" alt=""></img>');
  });
  it('should add to page', function () {
    var sample = (0, _jsx.jsx)("body", null, "Test");
    var $ = (0, _dom.html)(sample);
    $.applyPlugins([(0, _matomo.matomoAnalytics)(matomo)]);
    expect($.markup()).toBe("<!doctype html>\n<html><head></head><body>Test<script>\nvar disableStr = 'ga-disable-2';\n\nfunction gaOptout() {\n  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';\n  window[disableStr] = true;\n  alert('Tracking has been disabled.');\n}\n\nif (!((window.navigator && window.navigator['doNotTrack'] == 1) || (document.cookie && document.cookie.indexOf(disableStr + '=true') !== -1))) {    \n  var _paq = window._paq || []; \n  _paq.push(['trackPageView']);\n  _paq.push(['enableLinkTracking']);\n  (function() {\n    var u=\"https://stats.holtwick.de/matomo/\";\n    _paq.push(['setTrackerUrl', u+'matomo.php']);\n    _paq.push(['setSiteId', '2']);\n    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);\n  })();\n} \n</script> \n<noscript><p><img src=\"https://stats.holtwick.de/matomo/matomo.php?idsite=2&amp;rec=1\" style=\"border:0;\" alt=\"\"></p></noscript></body></html>");
  });
});