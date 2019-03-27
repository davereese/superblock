import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import logo from '../../resources/images/logo.svg';
import UserBadge from '../UserBadge/UserBadge';

/*
  This component displays the site header.
 */
function Header({
  user,
  onLogout,
  location
}) {
  const [badgeClicked, setbadgeClicked] = React.useState(0);

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
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
                  clickEvent={() => setbadgeClicked(!badgeClicked)}
                ></UserBadge>
              </div>
            </span>
          : null
        }
        {
          badgeClicked === true ?
          <button
            type="button"
            className="no-button inline-button"
            onClick={handleLogout}
          >Log Out</button>
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