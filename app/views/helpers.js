
const isProd = process.env.NODE_ENV === 'production';

//inject critical css from postbuild script
const criticalCSS = '<style>__CRITICAL__CSS__INJECTED__</style>';

export function initialPaint({res, initialState, headconfig, chunkManifest, styles, scripts, metaProperties}) {

  //initialView should also consist critical css for initial paint
  const initialHeadView = `
  <!doctype html>
    <html lang="en">
    <head>
      ${criticalCSS}
      ${headconfig.link ? headconfig.link : ''}
      ${headconfig.title ? headconfig.title : ''}
      ${headconfig.meta ? headconfig.meta : ''}
      <link rel="preconnect" href="https://linkpreview.dev">

      <link rel="cannonical" href="${metaProperties.cannonical}">
      <link rel="search" href="https://linkpreview.dev/opensearch.xml" type="application/opensearchdescription+xml" title="Namchey"/>

      <meta property="og:site_name" content="Link Preview">
      <meta property="og:title" content="${metaProperties.title}">
      <meta property="og:description" content="${metaProperties.desc}">
      <meta property="og:author" content="${metaProperties.author}">
      <meta property="og:author_url" content="${metaProperties.authorUrl}">
      <meta property="og:url" content="${metaProperties.url}">
      <meta property="og:image" content="${metaProperties.img}">
      <meta property="og:image:alt" content="${metaProperties.imgAlt}">
      <meta property="og:type" content="${metaProperties.type}">

      <meta name="twitter:title" content="${metaProperties.title}">
      <meta name="twitter:site" content="@linkpreviewdev">
      <meta name="twitter:description" content="${metaProperties.desc}">
      <meta name="twitter:url" content="${metaProperties.url}">
      <meta name="twitter:image" content="${metaProperties.img}">
      <meta name="twitter:author" content="${metaProperties.author}">
      <meta name="twitter:author_url" content="${metaProperties.authorUrl}">
      <meta name="twitter:card" content="${metaProperties.twitterCardType}">

      ${metaProperties.xmlOembedLink ? metaProperties.xmlOembedLink : ''}
      ${metaProperties.jsonOembedLink ? metaProperties.jsonOembedLink : ''}

      ${styles}
      <script>
          window.__PROD__ = ${JSON.stringify(isProd)};
          //<![CDATA[
            window.webpackManifest = ${JSON.stringify(headconfig.chunkManifest)};
          //]]>
      </script>
    </head>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.write(initialHeadView);
}
