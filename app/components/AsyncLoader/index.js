import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ErrorBoundary from 'components/ErrorBoundary';

import styles from './styles.css';
const cx = classNames.bind(styles);


class AsyncLoader extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false, component: null};
  }

  componentDidMount() {
    const { importPromise } = this.props;

    this.setState({loading: true, error: null});
    importPromise.then((component) => {
      this.setState({loading: false, component: component});
    }).catch((err) => {
      this.setState({loading: false, error: err});
    });
  }

  componentWillReceiveProps(newProps) {

  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          {this.state.loading && <div className={cx('loading')}></div>}
          {this.state.component && <this.state.component.default {...this.props} />}
        </ErrorBoundary>
      </div>
    );
  }
}

AsyncLoader.propTypes = {
  componentPath: PropTypes.string
};

export default AsyncLoader;
