import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import { connect } from 'react-redux';
import styles from './styles.css';

const cx = classNames.bind(styles);

class Player extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { twittercard } = this.props;
    return (
      <div>
        <div className={cx('twittercard-player')}>
          <iframe className={cx('player-frame')} src={twittercard['twitter:player']} frameBorder="0" allowFullScreen={true}></iframe>
        </div>
      </div>
    );
  }
}


Player.propTypes = {
  twittercard: PropTypes.object
};


export default Player;
