import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import configFactory from 'head/helmconfig.js';

class Meta extends React.Component {

  render() {
    const { assetManifest } = this.props;
    const siteConfig = configFactory(assetManifest);

    // Remove stylesheets because we do not extract them into a css file
    // in development mode
    if (__DEVSERVER__) {
      siteConfig.link = siteConfig.link.filter(l => l.rel !== 'stylesheet');
    }

    return (
      <Helmet
        title = {siteConfig.title}
        meta={siteConfig.meta}
        link={siteConfig.link}
      />
    );
  }
}

export default (document, assetManifest) => {
  ReactDOMServer.renderToString(<Meta {...{ assetManifest }} />);
  let header = Helmet.rewind();
  return header;
}
