import React, { Component } from 'react';
import { postBrowserError, postScreenShot } from 'actions/app';
//import html2canvas from 'html2canvas';

const IMG_QUALITY = 0.05;

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  postError(config) {
    postBrowserError(config).then((response) => {
      console.log('COMPONENT_ERROR_POSTED');
    }).catch((err) => {
      console.log('COMPONENT_ERROR_POST_ERROR');
    });
  }

  componentDidCatch(error, errorInfo) {

    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log error messages to an error reporting service here
    const config = {error: error.message, stack: error.stack, errorInfo: errorInfo.componentStack, source: 'ErrorBoundary'};
    if(__PRODCLIENT__ || __DEVCLIENT__) {
      console.log('dev client, prod client');
      config.url = window && window.location.href;
    }

    //if it is a client error, post screenshot to the server as well.
    if(__PRODCLIENT__) {
      import('html2canvas').then(module => {
        const html2canvas = module.default;
        return html2canvas(document.body, {logging: __PRODCLIENT__});
      }).then(canvas => {
        const imageData = canvas.toDataURL("image/jpeg", IMG_QUALITY);
        config.screenshot = imageData;
      	this.postError(config);
      });
    }

    if(__PRODSERVER__) {
      config.url = 'server_side';
      this.postError(config);
    }
  }

  homeLink(text) {
    return (
      <a onClick={() => {
          window.location.href = "/";
        }}>{text ? text : 'Go Home'}</a>
    );
  }

  render() {
    if (this.state.errorInfo) {

      if(!__DEVCLIENT__) {
        return (
          <div>
            <div className={`alert alert-normal ${this.props.className}`}>
              <p>Something went wrong on our end. Please try again later</p>
            </div>
            {this.homeLink()}
          </div>
        )
      }
      // Error path
      return (
        <div className={`${this.props.className}`}>
          <p className="alert alert-danger">Something went wrong on our end. Click on details to see the Stack.</p>
          {this.homeLink('Go Home You Are Drunk')}
          <pre className="well" style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
