import * as React from 'react';
import PropTypes from 'prop-types';

/* This component just renders a block graphic. It can be either
filled or stroked, and can be one of the specified colors if filled.
The component will also expand to fit within it's parent container.
COLORS
* primary - brand green
* js - yellow
* css - blue
* sass - pink
* html - red
*/
function Block({
  color,
  blockType,
  children,
}) {
  return (
    <div className={`block-image ${color} ${blockType}`}>
      <span>{children}</span>
      <svg viewBox="0 0 87 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.9923 14.4949H20.9923V12.4949V3.49857C20.9923 2.67093 21.6632 2 22.4908 2H64.4737C65.3014 2 65.9723 2.67093 65.9723 3.49857V12.4949V14.4949H67.9723H83.466C84.2936 14.4949 84.9645 15.1658 84.9645 15.9935V95.9609C84.9645 96.7885 84.2936 97.4594 83.466 97.4594H3.49857C2.67093 97.4594 2 96.7885 2 95.9609V15.9935C2 15.1658 2.67093 14.4949 3.49857 14.4949H18.9923Z"/>
      </svg>
    </div>
  );
};

Block.propTypes = {
  color: PropTypes.string,
  blockType: PropTypes.string,
  children: PropTypes.node,
};

Block.defaultProps = {
  color: 'primary',
  blockType: 'fill',
};

export default Block;