import React from 'react';

import Editor from '../../components/Editor/Editor'
import './Editing.scss';

class Editing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
    }
  }

  render() {
    // content will eventually hold what comes back from the api
    let content;

    const handleInputChange = (e) => {
      const field = e.target.id;
      this.setState({[field]: e.target.value});
    }

    const addTag = (e) => {
      // add tag
    }

    return (
      <React.Fragment>
        <div className="sidebar">
          <label htmlFor="language">Language</label><br/>
          <select
            id="language"
            value={this.state.target}
            onChange={handleInputChange}
          >
            <option value=''>Choose a Language</option>
            <option value='js'>JavaScript</option>
            <option value='css'>CSS</option>
            <option value='sass'>SASS</option>
            <option value='html'>HTML</option>
          </select>
          <label htmlFor="newtag">Tag</label><br/>
          <div className="input-and-button">
            <input type="text" id="newtag"/>
            <button type="button" onClick={addTag}>+</button>
          </div>
        </div>
        <div className="content">
          <Editor blockContent={content} language={this.state.language}/>
        </div>
      </React.Fragment>
    );
  }
}

export default Editing;