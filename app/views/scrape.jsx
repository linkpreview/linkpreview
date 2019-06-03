 //TODO change this tracking ID
const trackingID  = "'79016048-3'";

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
      </script>
        ${scripts}
        ${isProd ? analtyicsScript : ''}
    </body>
    </html>
  `;
}
