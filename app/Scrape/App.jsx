import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import Navigation from './Navigation';
import Message from 'components/Message';
import Footer from './Footer';
import classNames from 'classnames/bind';
import ErrorBoundary from 'components/ErrorBoundary';
import EmptySection from 'Scrape/EmptySection';
import EmptyContainer from 'Scrape/EmptyContainer';

import styles from './main.css';
import NProgress from 'nprogress';
const cx = classNames.bind(styles);
import { appLoaded, closeNetErrorComponent, toggleModal, closeAnnouncementMessageComponent } from 'actions/app';
import { serializeParams, sanitizeUtmFields } from 'utils';

export class App extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.isCodeLoading) {
            NProgress.start();
        }
        if(!newProps.isCodeLoading) {
            NProgress.done();
        }
    }

    componentDidMount() {
        this.props.dispatch(appLoaded(true));
        const { location: { query, pathname } } = this.props;
        if(query && (query.utm_source || query.referrer)) {
          this.props.dispatch(replace({
            pathname: pathname || '/',
            search: sanitizeUtmFields(query)
          }))
        }
    }

    render() {
        const { children, dispatch, appLoaded, netError, appMessage, showNetErrorComponent } = this.props;
        return (
          <div>
            <div className={cx('app')}>
                <div className={cx('app-container')}>
                  <ErrorBoundary>
                      <div>
                        <Navigation />
                      </div>
                  </ErrorBoundary>
                  <div className={cx('spacer')}></div>
                  <ErrorBoundary className="app-error-boundary">
                      <main className={cx('main-container')}>
                          <div className="container">
                            {showNetErrorComponent && <Message error={netError} removable={true} className="net-error" dispatch={dispatch} action={closeNetErrorComponent} /> }                                
                          </div>
                          {children}
                          {!children && <EmptyContainer><EmptySection text="Something went wrong"></EmptySection></EmptyContainer>}
                      </main>
                  </ErrorBoundary>

                  <ErrorBoundary>
                      <Footer appLoaded= {appLoaded} />
                  </ErrorBoundary>
                </div>
            </div>
          </div>
        );
    }
}


App.propTypes = {
  children: PropTypes.object
};


function mapStateToProps(state) {
    return {
        appMessage: state.app.appMessage,
        isCodeLoading: state.app.isCodeLoading,
        appLoaded: state.app.appLoaded,
        netError: state.app.netError,
        showNetErrorComponent: state.app.showNetErrorComponent,
    };
}

export default connect(mapStateToProps)(App);
