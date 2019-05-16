"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.meta = meta;

var _jsx = require("../site/jsx");

var _relativeurls = require("../site/relativeurls");

function meta() {
  var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    opt = Object.assign({}, gopt, opt);

    if (opt.url) {
      if (!(0, _relativeurls.isAbsoluteURL)(opt.url)) {
        console.warn('Canonical URLs need to be absolute, including the host name, instead got:', opt.url);
      } else {
        $('link[rel="canonical"]').remove();
        $('meta[property="og:url"]').remove();
        $('head').append((0, _jsx.jsx)("link", {
          rel: "canonical",
          href: opt.url
        })).append((0, _jsx.jsx)("meta", {
          property: "og:url",
          content: opt.url
        }));
      }
    }

    if (opt.lang) {
      $('html').attr('lang', opt.lang);
    }

    if (opt.alternate) {
      for (var _i = 0, _Object$keys = Object.keys(opt.alternate); _i < _Object$keys.length; _i++) {
        var lang = _Object$keys[_i];
        $('head').append((0, _jsx.jsx)("link", {
          rel: "alternate",
          hrefLang: lang,
          href: opt.alternate[lang]
        }));
      }
    }

    if (opt.title) {
      $('title').text(opt.title);
      $('meta[property="og:title"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        property: "og:title",
        content: opt.title
      }));
    }

    if (opt.description || opt.desc) {
      $('meta[name="description"]').remove();
      $('meta[property="og:description"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        name: "description",
        property: "og:description",
        content: opt.description || opt.desc
      }));
    }

    if (opt.keywords) {
      if (Array.isArray(opt.keyword)) {
        opt.keywords = opt.keywords.join(',');
      }

      $('meta[name="keywords"]').remove();
      $('meta[property="og:keywords"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        name: "keywords",
        property: "og:keywords",
        content: opt.keywords
      }));
    }

    if (opt.image) {
      if (!(0, _relativeurls.isAbsoluteURL)(opt.image)) {
        console.warn('Image URLs need to be absolute, including the host name, instead got:', opt.url);
      } else {
        $('meta[property="og:image"]').remove();
        $('head').append((0, _jsx.jsx)("meta", {
          property: "og:image",
          content: opt.image
        }));

        if (opt.title) {
          $('head').append((0, _jsx.jsx)("meta", {
            property: "og:image:alt",
            content: opt.title
          }));
        }
      }
    }

    if (opt.facebook) {
      $('meta[property="fb:app_id"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        property: "fb:app_id",
        content: opt.facebook
      }));
    }

    if (opt.twitter) {
      if (opt.twitter[0] !== '@') opt.twitter = '@' + opt.twitter;
      $('meta[name="twitter:site"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        name: "twitter:creator",
        content: opt.twitter
      })).append((0, _jsx.jsx)("meta", {
        name: "twitter:card",
        content: "summary"
      }));
    }

    if (opt.video) {
      $('meta[property="og:video"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        property: "og:video",
        content: opt.video
      }));
    }

    {
      $('meta[name="generator"]').remove();
      $('meta[property="og:type"]').remove();
      $('head').append((0, _jsx.jsx)("meta", {
        name: "generator",
        content: "SeaSite, https://github.com/holtwick/seasite/"
      })).append((0, _jsx.jsx)("meta", {
        property: "og:type",
        content: "website"
      }));
    }
  };
}