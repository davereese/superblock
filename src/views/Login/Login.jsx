import React from 'react';
import axios from 'axios';

/*
  This component displays the Login page view and functionality.
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  async loginUser() {
    try {
      const response = await axios.post('http://localhost:4000/api/login', {
        username: this.state.username,
        password: this.state.password
      });
      this.props.onLoginSuccess(response.data);
      this.props.history.push('/');
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const handleChange = (e) => {
      this.setState({[e.target.id]: e.target.value});
    }
  
    const handleLogin = (e) => {
      e.preventDefault();
      this.loginUser();
    }

    return (
      <React.Fragment>
        <div className="content login-container" role="main">
          <div className="login-container__form">
            <h1 className="header-lg">Log In</h1>
            <form action="">
              <label form="username">Username</label><br />
              <input
                type="text"
                id="username"
                autoComplete="off"
                value={this.state.username}
                onChange={handleChange}
              /><br />
              <label form="password">Password</label><br />
              <input
                type="password"
                id="password"
                value={this.state.password}
                onChange={handleChange}
              />
              <button
                type="submit"
                onClick={handleLogin}
              >Submit</button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;