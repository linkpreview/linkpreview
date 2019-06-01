import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles';

const cx = classNames.bind(styles);

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const NotFound = props => {
    return (
        <div className={cx('container', 'page-container', 'notfound-container')}>
          <h1 className={cx('header')}>Not Found</h1>
          <p className={cx('not-found-text')}> The Page You are looking for doesn't exist.</p>
        </div>
    );
};

export default NotFound;
