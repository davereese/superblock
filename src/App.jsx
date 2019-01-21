import React, { Component } from 'react';
import logo from './logo.svg';
import './styles/App.scss';

class App extends Component {
  render() {
    const tempLogo = {
      display: 'block',
      margin: '0 auto',
      marginTop: '45vh',
      width: '300px',
    };

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" style={tempLogo} />
        </header>
      </div>
    );
  }
}

export default App;
