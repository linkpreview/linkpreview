import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.css';
const cx = classNames.bind(styles);

const EmptyContainer = ({children}) => {
  if(!children) return null;
  return (
      <div className={cx('container')}>
        {children}
      </div>
  );
}

EmptyContainer.propTypes = {

};

export default EmptyContainer;
