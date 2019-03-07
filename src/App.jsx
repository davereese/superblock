import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import logo from './resources/images/logo.svg';
import Editing from './views/Editing/Editing';
import Login from './views/Login/Login';

const date = new Date();
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      currentUser: currentUser,
    }
  }

  render() {
    const updateLocation = (e) => {
      this.setState({location: e.target.pathname ? e.target.pathname : '/'});
    }

    const handleLogIn = (response) => {
      this.setState({currentUser: response});
      localStorage.setItem('currentUser', JSON.stringify(response));
    }

    const handleLogOut = () => {
      this.setState({currentUser: null});
      localStorage.removeItem('currentUser');
    }

    return (
      <div className="app">
        <Router>
          <React.Fragment>
            <header>
              <Link to="/" onClick={updateLocation}>
                <img src={logo} className="logo" alt="superblock" />
              </Link>
              <div className="user">
                {
                  this.state.currentUser !== null ?
                    <span className="user__details">
                      {this.state.currentUser.username}<br />
                      <button
                        type="button"
                        className="no-button inline-button"
                        onClick={handleLogOut}
                      >Log Out</button>
                    </span> : null
                }
                {
                  this.state.location !== '/login' && this.state.currentUser === null ?
                    <Link to="/login" onClick={updateLocation}>Log In</Link> : null
                }
              </div>
            </header>
            <div className="main">
              <Route path="/" exact component={Editing} />
              <Route path="/login" exact render={props => (
                <Login onLoginSuccess={handleLogIn} history={props.history} />
              )} />
            </div>
            <footer>
              <p>&copy; ${date.getFullYear()} SuperBlock. All rights reserved.</p>
            </footer>
          </React.Fragment>
        </Router>
      </div>
    );
  }
}

export default App;
