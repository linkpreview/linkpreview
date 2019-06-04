 //TODO change this tracking ID
const trackingID  = "79016048-3";

const analtyicsScript =
  typeof trackingID === "undefined" ? ``
    :
    `<!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-${trackingID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-${trackingID}');
    </script>
`;

/*
 * Our html template file
 * @param {String} renderedContent
 * @param initial state of the store, so that the client can be hydrated with the same state as the server
 * @param head - optional arguments to be placed into the head
 */
export default function renderFullPage(renderedContent, initialState, head, styles, scripts, metaProperties) {
  const isProd = process.env.NODE_ENV === 'production';

  let playerProps = '';

  if(metaProperties.twitterCardType === 'player') {
    playerProps = `<meta name="twitter:player" content="${metaProperties.embedLink}">
      <meta name="twitter:player:height" content="410">
      <meta name="twitter:player:width" content="800">`;
  }

  return `
  <!doctype html>
    <html lang="eng">
    <head>
      ${head.link ? head.link : ''}
      ${head.title ? head.title : ''}
      ${head.meta ? head.meta : ''}
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
              window.webpackManifest = ${JSON.stringify(head.scripts)};
            //]]>
        </script>
    </head>
    <body>
      ${isProd ? `<div id="scrape-container">${renderedContent}</div>` : `<div id="scrape-container"><div>${renderedContent}</div></div>`}
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        window.__DEV__ = ${!isProd};
        window.__EMBED_VIEW__ = ${metaProperties.isEmbedView};
      </script>
        ${scripts}
        ${isProd ? analtyicsScript : ''}
    </body>
    </html>
  `;
}
