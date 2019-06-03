import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './styles.css';

const cx = classNames.bind(styles);

class Oembed extends Component {

  constructor(props) {
    super(props);
    this.state = {html: null, error: null};
  }

  render() {
    const { oembed } = this.props;
    let body = {};
    let html = "Oembed not Discoverable";
    try {
        if(oembed.body) {
          body = JSON.parse(oembed.body);
          html = body.html
        }
    } catch(e) {
      console.log(e);
      html = "Error parsing oembed response"
    }

    return (
      <div>
        <div width={body.width} className={cx('oembed-container')}>
          {html && <div dangerouslySetInnerHTML = {{__html: html}}></div>}
        </div>
        <p><a href="https://oembed.com/">Click here </a> for more details about Oembed Protocol</p>
        {Object.keys(body).length && (<pre className={cx('detail')}>
          {JSON.stringify(body, null, 2)}
        </pre>)}
      </div>

    );
  }
}


Oembed.propTypes = {
  oembed: PropTypes.object,
  scrape: PropTypes.object
};


export default Oembed;
