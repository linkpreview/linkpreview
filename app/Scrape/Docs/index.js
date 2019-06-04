import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import { push } from 'react-router-redux';

import ErrorBoundary from 'components/ErrorBoundary';

import styles from './styles.css';
import Message from 'components/Message';

const cx = classNames.bind(styles);

const ENTER_KEY_CODE = 13;

export class Docs extends Component {

    constructor(props) {
      super(props);
    }

    componentDidMount() {

    }


    render() {

        return (
            <div className={cx('container')}>
              <div className={cx('docs-container')}>
                <h1>Docs</h1>
                <a target="_blank" href="https://github.com/namchey/linkpreview/blob/master/README.md">Read Me</a>
              </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {


    };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Docs);
