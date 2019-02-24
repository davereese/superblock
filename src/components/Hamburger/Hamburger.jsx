import * as React from 'react';
import PropTypes from 'prop-types';
import './Hamburger.scss';

/* This component just displays a hamburger menu graphic. It has a
 transition between expanded and collapsed.
 */
function Hamburger({
  open,
  classProp,
}) {
  const isExpanded = open ? 'expanded' : '';
  const isCollapsed = open === false ? 'collapsed' : '';

  return (
    <div
      className={`hamburger ${classProp} ${isExpanded} ${isCollapsed}`}
    ></div>
  )
}

Hamburger.propTypes = {
  open: PropTypes.bool,
  classProp: PropTypes.string,
};

Hamburger.defaultProps = {
  open: false,
  classProp: '',
};

export default Hamburger;