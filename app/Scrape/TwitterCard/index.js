import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import { connect } from 'react-redux';
import Player from './Player';

import { getTitle, getDescription, isImageSmall } from 'Scrape/helpers';
import styles from './styles.css';

const cx = classNames.bind(styles);

const SUMMARY_CARDS = ['summary', 'summary_large_image'];

class TwitterCard extends Component {

  constructor(props) {
    super(props);
    this.state = {summaryClass: 'summary-row'};
  }

  componentDidMount() {
    const imageEl = document.getElementById('twImage');
    isImageSmall(imageEl).then((res) => {
      if(res.isSmall) {
        this.setState({summaryClass: 'summary-column'});
      }
    });
  }

  getTitle() {
    const { scrape } = this.props;

    return getTitle(scrape, 'twittercard', this.state.summaryClass);

  }


  getDescription() {
    const { scrape } = this.props;

    return getDescription(scrape, 'twittercard', this.state.summaryClass);

  }

  summaryImage() {
    //image is in the ratio 1.91:1
    //both twitter and facebook link preview image size are same
    const { twittercard, scrape } = this.props;
    const cardImage = twittercard['twitter:image'] || twittercard['twitter:image:src'] || (scrape.json.tags.images && scrape.json.tags.images[0]);
    const alt = twittercard['twitter:image:alt'];

    return (<div className={cx('image-container')}>
      {cardImage && <img className={cx('image')} src={cardImage} ref={(el) => { this.twImage = el; }} id="twImage" alt={alt} />}
      {!cardImage && <div className={cx('dummy-image')}></div>}
    </div>);
  }

  summary() {
    const { twittercard } = this.props;
    const { scrape } = this.props;
    let hostname = '';
    if(twittercard['twitter:url']) {
      hostname = new URL(twittercard['twitter:url']).hostname;
    }
    if(scrape.json.url) {
      hostname = new URL(scrape.json.url).hostname;
    }

    return (<a className={cx('summary-container', this.state.summaryClass)} href={twittercard['twitter:url']}>
      {this.summaryImage()}
      <div className={cx('summary')}>
        <h3 className={cx('summary-title')}>{this.getTitle()}</h3>
        <p className={cx('summary-description')}>{this.getDescription()}</p>
        <span className={cx('summary-site')}>{hostname}</span>
      </div>
    </a>);
  }

  render() {
    const { twittercard } = this.props;
    return (
      <div>
        <div className={cx('twittercard-container')}>
          {this.summary()}
          {/*SUMMARY_CARDS.indexOf(twittercard['twitter:card']) !== -1 && this.summary()*/}
          {/*twittercard['twitter:card'] === 'player' && <Player twittercard = {twittercard} />*/}
        </div>
        <p className={cx('fade-text')}><a href="https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started.html">Click here </a> for more details about Twitter Card</p>
        {Object.keys(twittercard).length && (<pre className={cx('detail')}>
          {JSON.stringify(twittercard, null, 2)}
        </pre>)}
      </div>
    );
  }
}


TwitterCard.propTypes = {
  twittercard: PropTypes.object,
  scrape: PropTypes.object
};


export default TwitterCard;
