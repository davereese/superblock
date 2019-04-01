import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import Header from './components/Header/Header';
import Editing from './views/Editing/Editing';
import Login from './views/Login/Login';
import SignUp from './views/SignUp/SignUp';

const date = new Date();

// Check for logged in user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: currentUser,
    }
  }

  render() {
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
        <>
          <Header user={this.state.currentUser} onLogout={handleLogOut} />
          <div className="main">
            <Switch>
              <Route exact path={["/block/:id", "/"]} render={props => (
                <Editing user={this.state.currentUser} {...props} />
              )} />
              <Route path="/login" exact render={props => (
                <Login onLoginSuccess={handleLogIn} history={props.history} />
              )} />
              <Route path="/signup" exact render={props => (
                <SignUp onSignupSuccess={handleLogIn} history={props.history} />
              )} />
            </Switch>
          </div>
          <footer>
            <p>&copy; ${date.getFullYear()} SuperBlock. All rights reserved.</p>
          </footer>
        </>
      </div>
    );
  }
}

export default App;
