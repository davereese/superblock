import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import logo from './resources/images/logo.svg';
import Editing from './views/Editing/Editing';
import Login from './views/Login/Login';

const date = new Date();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: ''
    }
  }

  render() {
    const updateLocation = (e) => {
      this.setState({location: e.target.pathname ? e.target.pathname : '/'});
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
                {this.state.location !== '/login' ?
                  <Link to="/login" onClick={updateLocation}>Log In</Link> :
                  null}
              </div>
            </header>
            <div className="main">
              <Route path="/" exact component={Editing} />
              <Route path="/login" exact component={Login} />
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
