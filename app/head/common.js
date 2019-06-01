import { DESC } from './helmconfig';
/**
 * Common link tags for head
 * @type {*[]}
 */

export const links = [
  {'rel': 'dns-prefetch', 'href': 'https://cdnjs.cloudflare.com'},
];

/**
 * Common meta tags for head
 * @type {*[]}
 */
export const meta = [
  { 'charset': 'utf-8' },
  // Setting IE=edge tells Internet Explorer to use the latest engine to render the page and execute Javascript
  { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge,chrome=1' },
  { 'name': 'viewport', 'content': 'width=device-width, initial-scale=1' },
  // Add to homescreen for Chrome on Android
  { 'name': 'mobile-web-app-capable', 'content': 'yes' },
  // Add to homescreen for Safari on IOS
  { 'name': 'apple-mobile-web-app-capable', 'content': 'yes' }
];


/**
 * Common meta properties
 * @type {{}}
 */
export const commonMeta = (req, assetManifest) => {
  const currentUrl = req.url || '/';
  return {
    fb_app_id: req.fb_app_id,
    twitter_handle: '@linkpreviewdev',
    title:'Link Preview',
    desc: siteDesc,
    //img: req.featuredImageUrl || assetManifest['images/linpreview-logo.png'],
    //keep featured img instead of namchey logo
    author: 'Namchey',
    type: 'site',
    cannonical: req.clientConfig.site + req.path,
    twitterCardType: 'summary',
    authorUrl: req.clientConfig.site,
    url: currentUrl
  };
};
