import * as React from 'react';
import PropTypes from 'prop-types';

/*
  This component will display the logged in user's profile image.
  If the user does not have a profile image, a default will be used.
 */
function UserBadge({
  user,
  clickEvent
}) {
  const handleClick = (e) => {
    clickEvent(e);
  }

  return (
    <div
      className="user-badge"
      title={user.username}
      onClick={handleClick}
    ></div>
  );
};

UserBadge.propTypes = {
  user: PropTypes.object,
  clickEvent: PropTypes.func,
};

export default UserBadge;