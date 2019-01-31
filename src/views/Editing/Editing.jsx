import React from 'react';

import Editor from '../../components/Editor/Editor'

class Editing extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="sidebar">
          Sidebar
        </div>
        <div className="content">
          <Editor />
        </div>
      </React.Fragment>
    );
  }
}

export default Editing;