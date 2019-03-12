import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './components/Header/Header';
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
            <Header user={this.state.currentUser} onLogout={handleLogOut} />
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
