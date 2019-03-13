import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import logo from '../../resources/images/logo.svg';


function Header({
  user,
  onLogout,
  location
}) {
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
              {user.username}<br />
              <button
                type="button"
                className="no-button inline-button"
                onClick={handleLogout}
              >Log Out</button>
            </span> : null
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