import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/error';
import Loading from 'components/Loading';

const cx = classNames.bind(styles);

export default class ServerError extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  render() {
    return (
      <div>
         <div className={cx('alert','alert-danger')}>Oops! Something went Wrong.</div>
      </div>
    );
  }
}

ServerError.propTypes = {
};

