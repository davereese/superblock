import React from 'react';

import Editor from '../../components/Editor/Editor'

class Editing extends React.Component {
  render() {
    // content will eventually hold what comes back from the api
    let content;

    return (
      <React.Fragment>
        <div className="sidebar">
          Sidebar
        </div>
        <div className="content">
          <Editor blockContent={content} />
        </div>
      </React.Fragment>
    );
  }
}

export default Editing;