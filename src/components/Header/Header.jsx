import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import logo from '../../resources/images/logo.svg';
import UserBadge from '../UserBadge/UserBadge';
import Popup from '../Popup/Popup';

/*
  This component displays the site header.
 */
function Header({
  user,
  onLogout,
  location
}) {
  const [badgeClicked, setBadgeClicked] = React.useState(false);
  const [dropdownCoords, setDropdownCoords] = React.useState([0]);

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  }

  const handleBadgeClick = (e) => {
    const bounding = e.currentTarget.getBoundingClientRect();
    setBadgeClicked(true);
    setDropdownCoords([bounding.top, bounding.right, bounding.bottom, bounding.left]);
  }

  const closePopup = () => {
    setBadgeClicked(false);
  }

  return(
    <header>
      <Link to="/" className="logoLink">
        <img src={logo} className="logo" alt="superblock" />
      </Link>
      <div className="user">
        {
          user !== null ?
            <span className="user__details">
              <div className="user__badge">
                <UserBadge
                  user={user}
                  clickEvent={handleBadgeClick}
                ></UserBadge>
              </div>
            </span>
          : null
        }
        {
          badgeClicked === true ?
          <Popup
            position="bottom left"
            coords={dropdownCoords}
            dotPosition="top right"
            close={closePopup}
          >
            <h4 className="user__name">{user.username}</h4>
            <button
              type="button"
              className="no-button no-button-dark inline-button"
              onClick={handleLogout}
            >Log Out</button>
          </Popup>
          : null
        }
        {
          location.pathname !== '/login' && user === null ?
            <Link to="/login">Log In</Link> : null
        }
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  location: PropTypes.object,
};

export default withRouter(Header);