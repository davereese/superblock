import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import logo from './resources/images/logo.svg';
import './App.scss';
import Editing from './views/Editing/Editing';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Router>
          <React.Fragment>
            <header>
              <img src={logo} className="logo" alt="superblock" />
            </header>
            <div className="main">
              <Route path="/" exact component={Editing} />
            </div>
          </React.Fragment>
        </Router>
      </div>
    );
  }
}

export default App;
