import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { CustomLink as Link } from 'components/Link';
import MadeWithLove from 'components/MadeWithLove';
import { connect } from 'react-redux';
import namcheyLogo from 'images/namchey-logo.png';
import styles from './styles.css';


const cx = classNames.bind(styles);

class Footer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { appLoaded } = this.props;
    return (
      <footer className={cx('footer')}>
        <div className={cx('container')}>
            { appLoaded &&
              (<div className="fade-text">
                <img className={cx('namchey-logo')} src={namcheyLogo} alt="Namchey Logo" />
                <div className={cx('break-line')}></div>
                <MadeWithLove />
              </div>)
            }
        </div>
      </footer>
    );
  }
}


Footer.propTypes = {
};

function mapStateToProps(state) {
  return {
    appLoaded: state.app.appLoaded,
  };
}

export default connect(mapStateToProps)(Footer);
