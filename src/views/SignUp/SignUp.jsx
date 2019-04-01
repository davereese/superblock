import React from 'react';
import axios from 'axios';

/*
  This component displays the Sign up page view and functionality.
 */
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password2: '',
      email: '',
      error: null,
    }
  }

  componentDidMount() {
    document.title = "Superblock | Sign Up";
  }

  async signUpUser() {
    try {
      const response = await axios.post('http://localhost:4000/api/users', {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
      });
      this.props.onSignupSuccess(response.data);
      this.props.history.push('/');
    } catch (error) {
      this.setState({error: error.response.status});
    }
  }

  render() {
    const handleChange = (e) => {
      const id = e.target.id;
      this.setState({[e.target.id]: e.target.value, error: null}, () => {
        if (
          (id === 'password' || id === 'password2') &&
          this.state.password2 !== '' &&
          this.state.password !== this.state.password2
        ) {
          this.setState({error: 'noMatch'});
        } else {
          this.setState({error: null});
        }
      });
    }
  
    const handleSignUp = (e) => {
      e.preventDefault();
      this.signUpUser();
    }

    const requiredError = this.state.error === 400 ? 'error' : '';
    const dupeError = this.state.error === 500 ? 'error' : '';
    const passError = this.state.error === 'noMatch' ? 'error' : '';

    return (
      <>
        <div className="content signup-container" role="main">
          <div className="signup-container__form">
            <h1 className="header-lg">Sign Up</h1>
            {
              this.state.error === 400 ?
                <p className={`error center-text`}>Username and password are required.</p>
                : null
            }
            {
              this.state.error === 500 ?
                <p className={`error center-text`}>That username already exists. Please try something different.</p>
                : null
            }
            <form action="">
              <label htmlFor="username">Username</label><br />
              <input
                type="text"
                id="username"
                autoComplete="off"
                value={this.state.username}
                onChange={handleChange}
                className={`${requiredError} ${dupeError}`}
              /><br />
              <label htmlFor="email">Email</label><br />
              <input
                type="email"
                id="email"
                autoComplete="off"
                value={this.state.email}
                onChange={handleChange}
              /><br />
              <label htmlFor="password">Password</label><br />
              <input
                type="password"
                id="password"
                value={this.state.password}
                onChange={handleChange}
                className={`${requiredError} ${passError}`}
              />
              <label htmlFor="password2">Re-type Password</label><br />
              <input
                type="password"
                id="password2"
                value={this.state.password2}
                onChange={handleChange}
                className={`${requiredError} ${passError}`}
              />
              {
                this.state.error === 'noMatch' ?
                  <p className={`error center-text`}>Passwords don't match.</p>
                  : null
              }
              <button
                type="submit"
                onClick={handleSignUp}
                disabled={this.state.error !== null}
              >Submit</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default SignUp;