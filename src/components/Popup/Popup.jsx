import * as React from 'react';
import PropTypes from 'prop-types';

/*
  This component handles configuring how a popup will be positioned
  and if and where it will have a pointer.
 */
function Popup({
  children,
  passedClass,
  position,
  coords,
  dotPosition,
  close,
}) {
  const [popupOpen, setPopupOpen] = React.useState(null);
  const objectWidth = coords[1] - coords[3];

  if (popupOpen === null) {
    window.setTimeout(function() {
      setPopupOpen(true)
    }, 10);
  }

  const determinePosition = () => {
    const pos = position.split(' ');
    const popupPosition = {};
    switch (pos[0]) {
      case 'top':
        popupPosition.top = 'auto';
        popupPosition.bottom = `calc(100vh - ${coords[0] - 10}px)`;
        break;
      case 'right':
        popupPosition.left = `${coords[1] + 10}px`;
        popupPosition.right = 'auto';
        break;
      case 'bottom':
        popupPosition.top = `${coords[2] + 10}px`;
        popupPosition.bottom = 'auto';
        break;
      case 'left':
        popupPosition.left = 'auto';
        popupPosition.right = `calc(100vw - ${coords[3] - 10}px)`;
        break;
      default:
        popupPosition.top = pos[0];
        popupPosition.transform = `translateY(-${pos[0]})`;
        break;
    }

    switch (pos[1]) {
      case 'top':
        popupPosition.top = 'auto';
        popupPosition.bottom = `calc(100vh - ${coords[0] + 35}px`;
        break;
      case 'right':
        popupPosition.left = `${coords[1] - objectWidth - 7.5}px`;
        popupPosition.right = 'auto';
        break;
      case 'bottom':
        popupPosition.top = `${coords[2] - 35}px`;
        popupPosition.bottom = `auto`;
        break;
      case 'left':
        popupPosition.left = 'auto';
        popupPosition.right = `calc(100vw - ${coords[3] + objectWidth + 7.5}px)`;
        break;
      case 'center':
        if (pos[0] === 'top' || pos[0] === 'bottom') {
          popupPosition.left = (coords[1] + coords[3]) / 2;
          popupPosition.right = 'auto';
          popupPosition.transform = 'translateX(-50%)';
        } else {
          popupPosition.top = `${(coords[0] + coords[2]) / 2}px`;
          popupPosition.bottom = 'auto;'
          popupPosition.transform = 'translateY(-50%)';
        }
        break;
      default:
        popupPosition.left = pos[1];
        popupPosition.transform += `translateX(-${pos[1]})`;
        break;
    }
    return popupPosition;
  }

  const closePopup = () => {
    setPopupOpen(false)
    window.setTimeout(() => close(), 300);
  }

  const positionStyles = determinePosition();

  return (
    <>
      <div
        className={`popup ${dotPosition.replace(' ', '')} ${popupOpen} ${passedClass}`}
        style={positionStyles}
        role="dialog"
      >{children}</div>
      <div
        className={`popup-overlay`}
        onClick={closePopup}
      ></div>
    </>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  passedClass: PropTypes.string,
  position: PropTypes.oneOfType([
    PropTypes.oneOf([
      'top left',
      'top center',
      'top right',
      'bottom left',
      'bottom center',
      'bottom right',
      'left top',
      'left center',
      'left bottom',
      'right top',
      'right center',
      'right bottom',
    ]),
    PropTypes.string,
  ]),
  coords: PropTypes.array,
  dotPosition: PropTypes.oneOf([
    'top left',
    'top center',
    'top right',
    'bottom left',
    'bottom center',
    'bottom right',
    'left top',
    'left center',
    'left bottom',
    'right top',
    'right center',
    'right bottom',
    'none'
  ]),
};

Popup.defaultProps = {
  passedClass: '',
  position: 'top left',
  coords: [0],
  dotPosition: 'none',
};

export default Popup;