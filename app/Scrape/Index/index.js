import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import { push } from 'react-router-redux';

import ErrorBoundary from 'components/ErrorBoundary';
import { getScrapes } from 'Scrape/actions';

import styles from './styles';
import Message from 'components/Message';

import OpenGraph from 'Scrape/OpenGraph';
import TwitterCard from 'Scrape/TwitterCard';
import Oembed from 'Scrape/Oembed';

import { SCRAPE_BASE_ROUTE } from 'Scrape/routes';
import { serializeParams } from 'utils';
const cx = classNames.bind(styles);

const ENTER_KEY_CODE = 13;

export class Index extends Component {

    constructor(props) {
      super(props);
      this.state = {url: ''};
    }

    componentDidMount() {
      const { location: { query, pathname } } = this.props;
      if(query && query.url) {
        this.setState({url: query.url}, () => {
          this.onSearch();
        });
      }
    }

    onSearch = (e) => {
      if(!this.state.url) return;

      const { dispatchScrape, dispatchPush } = this.props;
      const { location: { query, pathname } } = this.props;

      dispatchPush({
        pathname: pathname,
        search: serializeParams({url: this.state.url})
      });

      dispatchScrape({query: {url: this.state.url}, options: {}});

    };

    onKeyDown = (event) => {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.onSearch();
      }
    };

    onUrlChange = (e) => {
      this.setState({url: e.target.value});
    };

    goToTop = () => {
      window.scrollTo(0,0);
    };

    render() {
        const { scrape, isFetching, error, message, authenticated, isCodeLoading, appLoaded } = this.props;
        if(scrape && scrape.json) {
          /*Easy inpection from console*/
          console.log('scrape', scrape);
        }
        return (
            <div className={cx('container')}>
              <div className={cx('index-container')}>
                <a className={cx('go-to-top')} onClick={this.goToTop}>Go To Top</a>
                <section>
                  <h3>Enter URL below:</h3>
                  <div>
                    <input type="text" value={this.state.url} onChange={this.onUrlChange} onKeyDown={this.onKeyDown} className={cx('input-url')} id="url" name="url" required ref={(el) => { this.url = el; }} key={'input-url'} placeholder="e.g. https://namchey.com" />
                    {error && <Message error={error} />}
                  </div>
                  <div className={cx('break-line')}></div>
                  <button className="btn btn-success" onClick={this.onSearch}>Scrape</button>
                </section>

                {isFetching && <div className={cx('loading')}></div>}
                {scrape && scrape.json && <div><hr /><p>The links will look something like this in facebook, twitter and other platform that supports these protocols </p></div>}

                <section>
                  <div className={cx('card')}>
                    {scrape && scrape.json && scrape.json.opengraph && <div><h3>OpenGraph</h3><OpenGraph scrape={scrape} opengraph={scrape.json.opengraph} /></div>}
                  </div>

                  <div className={cx('card')}>
                    {scrape && scrape.json && scrape.json.twittercard && <div><h3>TwitterCard</h3><TwitterCard scrape={scrape} twittercard={scrape.json.twittercard} /></div>}
                  </div>

                  <div className={cx('card')}>
                    {scrape && scrape.json && scrape.json.oembed && <div><h3>Oembed</h3><Oembed scrape={scrape} oembed={scrape.json.oembed} /></div>}
                  </div>
                </section>


                {scrape && scrape.json && (
                  <div>
                    <hr />
                    <h3>Details</h3>
                    <p className={cx('fade-text')}>You can also inspect from console</p>
                    <pre className={cx('detail')}>
                      {JSON.stringify(scrape, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        scrape: state.scrape.scrape,
        isFetching: state.scrape.isFetching,
        error: state.scrape.error,
        message: state.scrape.message,
        appLoaded: state.app.appLoaded,
        isCodeLoading: state.app.isCodeLoading,

    };
}

function mapDispatchToProps(dispatch) {
  return {
      dispatchPush: (params) => { return dispatch(push(params))},
      dispatchScrape: (params) => { return dispatch(getScrapes(params))}
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
