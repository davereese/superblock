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
      title: 'Block',
      tags: [],
      isNew: true,
      customTitle: false,
      unsaved: false,
      isOpen: '',
    }

    this.tagInputRef = React.createRef();

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
        isNew: false,
        customTitle: true,
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
      }).then(() => {
        this.setState({unsaved: false});
        this.props.history.push(`/block/${block.data.id}`);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateBlock() {
    try {
      await axios.put(`http://localhost:4000/api/blocks/${this.props.match.params.id}`, {
        content: this.state.content,
        title: this.state.title,
        language: this.state.language,
        tags: this.state.tags,
      },{
        headers: {
          'authorization': this.props.user.token
        }
      }).then(() => {
        this.setState({unsaved: false});
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteBlock() {
    try {
      await axios.delete(`http://localhost:4000/api/blocks/${this.props.match.params.id}`, {
        headers: {
          'authorization': this.props.user.token
        }
      });

      this.setState({
        content: '',
        title: 'Block',
        language: '',
        tags: [],
        isNew: true,
        customTitle: false,
        unsaved: false,
      });
      this.props.history.push('/');
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const handleLanguageChange = (e) => {
      this.setState({
        language: e.target.value,
        unsaved: true,
      });

      if (!this.state.customTitle) {
        this.setState({title: `${e.target.value} Block`});
      }
    }

    const handleSidebarToggle = (e) => {
      this.setState({isOpen: !this.state.isOpen});
    }

    const handleUpdate = (update) => {
      if (!this.state.customTitle && update.title !== this.state.title) {
        this.setState({ customTitle: true });
      }

      this.setState({
        title: update.title,
        content: update.content,
        unsaved: true,
      });
    }

    const handleAddTag = (e) => {
      const tags = this.state.tags;
      if (this.tagInputRef.current.value) {
        tags.push(this.tagInputRef.current.value);
        this.setState({
          tags: tags,
          unsaved: true,
        });
      }
    }

    const handleDeleteTag = (index) => {
      const tags = this.state.tags;
      tags.splice(index, 1);
      this.setState({
        tags: tags,
        unsaved: true,
      });
    }

    const handleSaveBlock = (e) => {
      if (this.state.isNew) {
        this.saveBlock();
      } else {
        this.updateBlock();
      }
    }

    const handleDeleteBlock = () => {
      this.deleteBlock();
    }

    /** DYNAMIC STYLES **/
    const displaySave = {
      opacity: `${this.state.unsaved ? 1 : 0}`,
      right: `${this.state.language.length > 0 ? '55px' : '13px'}`,
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
                  <input
                    type="text"
                    id="newtag"
                    ref={this.tagInputRef}
                  />
                  <button type="button" onClick={handleAddTag}>+</button>
                </div>
                {this.state.tags.length > 0 ?
                  <ul className="tagsList">
                    {this.state.tags.map((tag, index) => {
                      return (
                        <li className="tagsList__tag" key={index}>
                          {tag}
                          <button
                            className="no-button close-button"
                            onClick={(e) => {handleDeleteTag(index)}}
                          ></button>
                        </li>
                      );
                    })}
                  </ul>
                  : null
                }
              </>
            : null
          }

          <button
            type="button"
            className="full-width sidebar-save-block"
            onClick={handleSaveBlock}
            disabled={!this.state.unsaved}
          >{ this.state.isNew ? 'Save' : 'Update' }</button>

          {!this.state.isNew ?
            <div className="delete-block">
              <button
                className="delete-block__button full-width"
                onClick={handleDeleteBlock}
              >Delete</button>
            </div>
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
          <button
            type="button"
            className="inline-button save-block"
            style={displaySave}
            onClick={handleSaveBlock}
          >{ this.state.isNew ? 'Save' : 'Update' }</button>
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