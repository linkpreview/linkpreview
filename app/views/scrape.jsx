/*
 * To Enable Google analytics simply replace the hashes with your tracking ID
 * and move the constant to above the analtyicsScript constant.
 *
 * Currently because the ID is declared beneath where is is being used, the
 * declaration will get hoisted to the top of the file.
 * however the assignement  does not, so it is undefined for the type check above.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting
 */
 //TODO change this tracking ID
const trackingID  = "'123'";

const analtyicsScript =
  typeof trackingID === "undefined" ? ``
    :
    `<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', ${trackingID}, 'auto');
    ga('send', 'pageview');
  </script>`;

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
        ${analtyicsScript}
    </body>
    </html>
  `;
}
