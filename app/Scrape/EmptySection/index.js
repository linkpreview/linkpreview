import React  from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.css';
const cx = classNames.bind(styles);

const EmptySection = ({ text }) => {
  return (
    <div className={cx('empty-section')}><p>{text || 'Nothing to show here.'}</p></div>
  );
};

EmptySection.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

export default EmptySection;
