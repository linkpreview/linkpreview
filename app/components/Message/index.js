import React  from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.css';

const cx = classNames.bind(styles);

const Message = ({message, error, normal, warning, isFixed, className, removable, dispatch, action}) => {

  const closeButton = removable && <span className={cx('btn-close', 'pull-right')} onClick = {(e) => {dispatch(action())}}>X</span>;

  return (
    <div className={cx('Message', isFixed ? 'message-fixed' : '', className)}>
      {message ?<div className={cx('alert', 'alert-success')}>
        <b>{message}</b>
        {closeButton}
      </div>: '' }
      {error ? <div className={cx('alert', 'alert-danger')}>
        <b>{error}</b>
        {closeButton}
      </div>: '' }
      {normal ? <div className={cx('alert', 'alert-normal')}>
        <b>{normal}</b>
        {closeButton}
      </div>: '' }
      {warning ? <div className={cx('alert', 'alert-warning')}>
        <b>{warning}</b>
        {closeButton}
      </div>: '' }
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string,
  error: PropTypes.string
};

export default Message;
