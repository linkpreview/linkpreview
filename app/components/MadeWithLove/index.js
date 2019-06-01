import React from 'react';
import UTFSymbol from 'components/UTFSymbol';
import classNames from 'classnames/bind';
import styles from './styles.css';
import { getBgAndFgStyles, getNamcheyUtmFieldsAgency } from 'utils/page';

const cx = classNames.bind(styles);

const MadeWithLove = ({ showName = true, page = {}}) => {
  let colors = page.colors || {};
  return (
    <div style={getBgAndFgStyles(null, colors.footBarFg)} className={cx('fade-text','made-with-love-container')}>
      <div className={cx('column')}>Made with</div>
      <div className={cx('column', 'colum-love')}>
        <small className={cx('made-with-love')}>
          <UTFSymbol style={{color: colors.primary}} code="10084" />
        </small>
      </div>
      <div className={cx('column')}>
        by {showName ? <a style={getBgAndFgStyles(null, colors.footBarFg)} href={`https://namchey.com?${getNamcheyUtmFieldsAgency({page})}&utm_content=made_with_love`} target="__blank">Namchey</a> : null}
      </div>
    </div>

  );
};

export default MadeWithLove;
