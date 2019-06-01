import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { typeChecker } from 'utils';

export class CustomLink extends Component {

  constructor(props) {
    super(props);
    this.state = {isClicked: false};
  }

  linkOnClick = (e) => {
    const { to, target } = this.props;

    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    this.setState({isClicked: true});

    if(!to) return null;

    if ((typeof window !== 'undefined' && window.swUpdate) || target === '_blank') return window.open(to, target);

    return browserHistory.push(to);
  };

  render() {
    const {to, className = '', disableFadeEffect,  target = '', ...rest} = this.props;

    return <Link
      to={to}
      className={`${className} ${(!disableFadeEffect && this.state.isClicked) ? 'isClicked': ''}`}
      target = {target}
      {...rest}
      onClick={this.linkOnClick}/>;
  }
}

/*
export const CustomLink = ({to, className, target = '', ...rest}) => {

  return <Link
            to={to}
            className={className}
            target = {target}
            {...rest}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) return;
              e.preventDefault();

              if(!to) return null;

              if (window.swUpdate || target === '_blank') return (window.open(to, target));
              return browserHistory.push(to);
            }}/>;
};*/

CustomLink.propTypes = {
};
