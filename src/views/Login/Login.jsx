import React from 'react';

/*
  This component displays the Login page view. It's set up as a class component
  for now, because it may need to use state at some point in the future.
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const handleLogin = (e) => {
      // do stuff
    }

    return (
      <React.Fragment>
        <div className="content login-container" role="main">
          <div className="login-container__form">
            <h1 className="header-lg">Log In</h1>
            <label form="username">Username</label><br />
            <input
              type="text"
              id="username"
              autoComplete="off"
            /><br />
            <label form="password">Password</label><br />
            <input
              type="password"
              id="password"
            />
            <button
              type="submit"
              onClick={handleLogin}
            >Submit</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;