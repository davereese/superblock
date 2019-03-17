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

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id && this.props.match.params.id) {
      this.queryBlock(this.props.match.params.id);
    }
  }

  async queryBlock(blockId) {
    try {
      const response = await axios.get(`http://localhost:4000/api/blocks/${blockId}`, {
        headers: {
          'authorization': this.props.user.token
        },
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

  async saveBlock() {
    try {
      const block = await axios.post(`http://localhost:4000/api/blocks/`, {
        content: this.state.content,
        title: this.state.title,
        language: this.state.language,
        tags: this.state.tags,
      },{
        headers: {
          'authorization': this.props.user.token
        }
      });

      this.props.history.push(`/block/${block.data.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const handleLanguageChange = (e) => {
      this.setState({title: `${e.target.value} block`});
      this.setState({language: e.target.value});
    }

    const handleSidebarToggle = (e) => {
      this.setState({isOpen: !this.state.isOpen});
    }

    const handleUpdate = (update) => {
      this.setState({
        title: update.title,
        content: update.content
      });
    }

    const addTag = (e) => {
      // add tag
    }

    const handleSaveBlock = (e) => {
      this.saveBlock();
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
            value={this.state.language}
            onChange={handleLanguageChange}
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

          <button
            type="button"
            className="full-width"
            onClick={handleSaveBlock}
          >Save</button>

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
            onUpdate={handleUpdate}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Editing;