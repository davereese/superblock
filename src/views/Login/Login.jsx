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
      error: null,
    }
  }

  componentDidMount() {
    document.title = "Superblock | Log In";
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
      this.setState({error: error.response.status});
    }
  }

  render() {
    const handleChange = (e) => {
      this.setState({[e.target.id]: e.target.value, error: null});
    }
  
    const handleLogin = (e) => {
      e.preventDefault();
      this.loginUser();
    }

    const userError = this.state.error === 404 ? 'error' : '';
    const passError = this.state.error === 401 ? 'error' : '';

    return (
      <>
        <div className="content login-container" role="main">
          <div className="login-container__form">
            <h1 className="header-lg">Log In</h1>
            {
              this.state.error === 404 ?
                <p className={`error center-text`}>No user with that name found. Please try again.</p>
                : null
            }
            {
              this.state.error === 401 ?
                <p className={`error center-text`}>Incorrect password. Please try again.</p>
                : null
            }
            <form action="">
              <label form="username">Username</label><br />
              <input
                type="text"
                id="username"
                autoComplete="off"
                value={this.state.username}
                onChange={handleChange}
                className={userError}
              /><br />
              <label form="password">Password</label><br />
              <input
                type="password"
                id="password"
                value={this.state.password}
                onChange={handleChange}
                className={passError}
              />
              <button
                type="submit"
                onClick={handleLogin}
              >Submit</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Login;