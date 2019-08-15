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
 * @param {String} componentHTML
 * @param initial state of the store, so that the client can be hydrated with the same state as the server
 * @param head - optional arguments to be placed into the head
 */
export default function renderFullPage({componentHTML, initialState, head, styles, scripts, metaProperties}) {
  const isProd = process.env.NODE_ENV === 'production';

  return `

    <body>
      ${isProd ? `<div id="scrape-container">${componentHTML}</div>` : `<div id="scrape-container"><div>${componentHTML}</div></div>`}
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
