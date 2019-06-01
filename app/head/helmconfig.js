import { links, meta } from 'head/common';

export const TITLE = 'Link Preview';

export const DESC = 'Open Graph, Twitter Card, Oembed Link Preview. Shows visual cards that mimics link previews in facebook, twitter and other sites that support link preview.';

export const KEYWORDS = 'opengraph,linkpreview,twittercard,oembed';

//helper
const capitalize = (str) => {
  return str && str.capitalize();
};

export default (assetManifest = {}) => {
  const title = TITLE;

  const config = {
    title,

    link: [
      ...links,
      // Add to homescreen for Chrome on Android
      { 'rel': 'shortcut icon', 'href': assetManifest['images/favicon.ico'] },
      { 'rel': 'icon', 'href': assetManifest['images/favicon.ico'] },
      // Add to homescreen for Safari on IOS
      { 'rel': 'apple-touch-icon', 'sizes': '152x152 180x180', 'href': assetManifest['images/ios.png'] },
      { 'rel': 'fluid-icon', 'href': assetManifest['images/fluid.png'] }
      // SEO: If your mobile URL is different from the desktop URL,
      // add a canonical link to the desktop page https://developers.google.com/webmasters/smartphone-sites/feature-phones
      //{ 'rel': 'canonical', 'href': 'https://namchey.com/'}
    ],
    meta: [
      ...meta,
      //  Meta descriptions are commonly used on search engine result pages to display preview snippets for a given page.
      { 'name': 'description', 'content':  DESC},
      { 'name': 'keywords', 'content': KEYWORDS },
      { 'name': 'apple-mobile-web-app-status-bar-style', 'content': 'black' },
      { 'name': 'apple-mobile-web-app-title', 'content': title },
      // Tile icon for Win8 (144x144 + tile color)
      { 'name': 'msapplication-TileImage', 'content': assetManifest['images/favicon.png'] },
      { 'name': 'msapplication-TileColor', 'content': '#FFFFFF' },
      { name: 'application-name', content: 'Link Preview'}
    ]
  };

  return config;
};
