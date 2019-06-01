import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import classNames from 'classnames/bind';
import { SCRAPE_BASE_ROUTE } from 'Scrape/routes';
import styles from './styles';
const cx = classNames.bind(styles);

//comps/Itinerary/helpers.js
class Navigation extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        const { routeLoading, isCodeLoading, appLoaded, locationBeforeTransitions } = this.props;
        const isLoading = !appLoaded || isCodeLoading || routeLoading;

        if(isLoading) {
          return (<div className={cx('navigation')}>
            <div className={cx('container')}>
            <span to={`${SCRAPE_BASE_ROUTE}`}
                  className={cx('logo-cont')}><span className={cx('logo') + ' logo-global' }></span></span>
              <span className={cx('dummy-user')}></span>
              <div className={cx('dummy-search')}></div>
            </div>
          </div>);
        }

        return (
            <nav className={cx('navigation')} role="navigation">
                <div className={cx('container','container-nav')}>
                        <div className={cx('nav-items')}>
                          <div className={cx('logo-items')}>
                            <span to={`${SCRAPE_BASE_ROUTE}`}
                                  className={cx('logo-cont')}><span className={cx('logo') + ' logo-global' }></span></span>
                          </div>
                        </div>
                </div>
            </nav>
        );
    }
}

Navigation.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    isSearching: state.app.isSearching,
    routeLoading: state.app.routeLoading,
    fullScreenMode: state.app.fullScreenMode,
    locationBeforeTransitions: state.routing.locationBeforeTransitions,
    isCodeLoading: state.app.isCodeLoading,
    appLoaded: state.app.appLoaded
  };
}

export default connect(mapStateToProps)(Navigation);
