import React from 'react';
import UTFSymbol from 'components/UTFSymbol';
import classNames from 'classnames/bind';
import styles from './styles.css';

const cx = classNames.bind(styles);

const MadeWithLove = () => {
  return (
    <div className={cx('fade-text','made-with-love-container')}>
      <div className={cx('column')}>Made with</div>
      <div className={cx('column', 'colum-love')}>
        <small className={cx('made-with-love')}>
          <UTFSymbol code="10084" />
        </small>
      </div>
      <div className={cx('column')}>
        by <a href={`https://namchey.com?utm_source=linkpreview.dev&utm_medium=site&utm_campaign=opensource&utm_content=made_with_love`} target="__blank">Namchey</a>
      </div>
    </div>

  );
};

export default MadeWithLove;
