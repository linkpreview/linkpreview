import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import { connect } from 'react-redux';
import styles from './styles.css';
import { getTitle, getDescription, isImageSmall } from 'Scrape/helpers';

const cx = classNames.bind(styles);

class OpenGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {summaryClass: 'summary-row'};
  }

  componentDidMount() {
    const imageEl = document.getElementById('ogImage');
    isImageSmall(imageEl).then((res) => {
      if(res.isSmall) {
        this.setState({summaryClass: 'summary-column'});
      }
    });

  }

  getTitle() {
    const { opengraph, scrape } = this.props;

    return getTitle(scrape, 'opengraph', this.state.summaryClass);

  }


  getDescription() {
    const { opengraph, scrape } = this.props;

    return getDescription(scrape, 'opengraph', this.state.summaryClass);

  }

  getImage() {
    const { opengraph, scrape } = this.props;
    const cardImage = opengraph['og:image'] || (scrape.json.tags.images && scrape.json.tags.images[0]);
    return (<div className={cx('image-container')}>
      {cardImage && <img className={cx('image')} src={cardImage} ref={(el) => { this.ogImage = el; }} id="ogImage" alt={opengraph['og:image:alt']} />}
      {!cardImage && <div className={cx('dummy-image')}></div>}
    </div>);
  }

  render() {
    const { opengraph, scrape } = this.props;
    let hostname = '';
    if(opengraph['og:url']) {
      hostname = new URL(opengraph['og:url']).hostname;
    }

    if(scrape.json.url) {
      hostname = new URL(scrape.json.url).hostname;
    }

    return (
      <div>
        <div className={cx('opengraph-container')}>
          <a href={opengraph['og:url']} className={cx('summary-container', this.state.summaryClass)}>
            {this.getImage()}
            <div className={cx('summary')}>
              <span className={cx('summary-site')}>{hostname}</span>
              <h3 className={cx('summary-title')}>{this.getTitle()}</h3>
              <p className={cx('summary-description')}>{this.getDescription()}</p>
            </div>
          </a>
        </div>
        <p><a href="http://www.ogp.me/">Click here </a> for more details about The Open Graph protocol</p>
        {Object.keys(opengraph).length && (<pre className={cx('detail')}>
          {JSON.stringify(opengraph, null, 2)}
        </pre>)}
      </div>
    );
  }
}


OpenGraph.propTypes = {
  opengraph: PropTypes.object,
  scrape: PropTypes.object
};


export default OpenGraph;
