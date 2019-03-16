import React from 'react';
import axios from 'axios';

import Editor from '../../components/Editor/Editor'
import Hamburger from '../../components/Hamburger/Hamburger';

class Editing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      language: '',
      isOpen: '',
      title: 'Block',
      tags: [],
    }

    // query the block
    if (props.match.params.id) {
      this.queryBlock(props.match.params.id);
    }
  }

  async queryBlock(blockId) {
    try {
      const response = await axios.get(`http://localhost:4000/api/blocks/${blockId}`, {
        headers: {
          'authorization': this.props.user.token
        }
      });
      const data = response.data[0];
      this.setState({
        content: data.content,
        title: data.title,
        language: data.language,
        tags: data.tags,
      });
    } catch (error) {
      // handle error
      console.error(error);
    }
  }

  render() {
    const handleInputChange = (e) => {
      const field = e.target.id;
      this.setState({title: `${e.target.value} block`});
      this.setState({[field]: e.target.value});
    }

    const handleSidebarToggle = (e) => {
      this.setState({isOpen: !this.state.isOpen});
    }

    const addTag = (e) => {
      // add tag
    }

    return (
      <React.Fragment>
        <div
          className={`sidebar ${this.state.isOpen}`}
          role="complementary"
        >
          <label htmlFor="language">Language</label><br />
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

          {
            this.props.user !== null ?
              <>
                <label htmlFor="newtag">Tag</label><br />
                <div className="input-and-button">
                  <input type="text" id="newtag" />
                  <button type="button" onClick={addTag}>+</button>
                </div>
                <ul className="tagsList">
                </ul>
              </>
            : null
          }

        </div>
        <div
          className={`content ${this.state.isOpen}`}
          role="main"
        >
          {/* h1 tag is in the editor component */}
          <button
            className="no-button sidebar-toggle"
            onClick={handleSidebarToggle}
          ><Hamburger open={this.state.isOpen ? true : false}></Hamburger>
          </button>
          <Editor
            blockTitle={this.state.title}
            blockContent={this.state.content}
            language={this.state.language}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Editing;