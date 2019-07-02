import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import { push } from 'react-router-redux';

import ErrorBoundary from 'components/ErrorBoundary';

import styles from './styles.css';
import Message from 'components/Message';
import doggo from 'images/doggo-new.jpg';
import favicon from '../../../static/favicon.ico';

const cx = classNames.bind(styles);

const ENTER_KEY_CODE = 13;

export class Embed extends Component {

    constructor(props) {
      super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <div className={cx('embed-container')}>
              <h1 className={cx('title')}>Link Preview</h1>
              <a href="https://linkpreview.dev" target="__blank">
                <img className={cx('image')} src={doggo} alt="A dog with different eye color" />
              </a>
              <p className={cx('description')}>Open Graph, Twitter Card, Oembed preview. Shows visual cards that mimics link previews in facebook, twitter and other sites that support link preview.</p>
              <div className={cx('footer')}>
                <img className={cx('favicon')} src={favicon} alt="" />
                <a href="https://linkpreview.dev" target="__blank">https://linkpreview.dev</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Embed);
