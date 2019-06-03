import React  from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

const UTFSymbol = ({ code, className }) => {
  return (
    <span className={className}>{String.fromCharCode(code)}</span>
  );
};

UTFSymbol.propTypes = {
  code: PropTypes.string.isRequired
};

export default UTFSymbol;
