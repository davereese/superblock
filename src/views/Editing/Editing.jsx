import React from 'react';
import PropTypes from 'prop-types';

import * as Block from './block-requests';
import Editor from '../../components/Editor/Editor'
import Hamburger from '../../components/Hamburger/Hamburger';
import TagForm from './TagForm';
import Modal from '../../components/Modal/Modal';

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
      modalOpen: null,
    };
  }

  componentDidMount() {
    const isOpen = localStorage.getItem('isOpen');
    if (isOpen === 'true') {
      this.setState({isOpen: true});
    }

    // query the block
    if (this.props.match.params.id) {
      this.queryBlock(this.props.match.params.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id && this.props.match.params.id) {
      this.queryBlock(this.props.match.params.id);
    } else if (prevProps.match.params.id && !this.props.match.params.id) {
      this.resetBlock();
    } else if (prevProps.user !== null && this.props.user === null) {
      this.resetBlock();
      this.props.history.push('/');
    }
  }

  async queryBlock(blockId) {
    Block.queryBlock(blockId).then((res) => {
      if (res && !res.error) {
        this.setState({
          content: res.content,
          title: res.title,
          language: res.language,
          tags: res.tags,
          isNew: false,
          customTitle: true,
        });
      } else {
        // handle error
        this.props.history.push('/');
      }
    });
  }

  async handleSaveBlock(e) {
    if (this.state.isNew) {
      Block.saveBlock(this.state).then((res) => {
        if (!res.error) {
          this.setState({unsaved: false});
          this.props.history.push(`/block/${res.id}`);
        } else {
          // handle error
        }
      });
    } else {
      Block.updateBlock(this.props.match.params.id, this.state).then((res) => {
        if (!res) {
          this.setState({unsaved: false});
        } else {
          // handle error
        }
      });
    }
  }

  async deleteBlock() {
    Block.deleteBlock(this.props.match.params.id).then((res) => {
      if (!res) {
        this.resetBlock()
        this.props.history.push('/');
      } else {
        // handle error
      }
    });
  }

  resetBlock() {
    this.setState({
      content: '',
      title: 'Block',
      language: '',
      tags: [],
      isNew: true,
      customTitle: false,
      unsaved: false,
    });
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
      this.setState({isOpen: !this.state.isOpen}, () => {
        localStorage.setItem('isOpen', this.state.isOpen);
      });
    }

    const handleUpdate = (update) => {
      if (!this.state.customTitle && update.title !== this.state.title) {
        this.setState({ customTitle: true });
      }

      this.setState({
        title: update.title,
        content: update.content,
        unsaved: update.content.length > 0 ? true : false,
      });
    }

    const handleAlterTags = (tagsArray) => {
      this.setState({
        tags: tagsArray,
        unsaved: true,
      });
    }

    const handleDeleteBlock = () => {
      toggleModal();
    }

    const toggleModal = (action) => {
      if (action) { action(); }
      this.setState({modalOpen: !this.state.modalOpen});
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
            <TagForm tags={this.state.tags} alterTags={handleAlterTags}></TagForm>
            : null
          }

          <button
            type="button"
            className="full-width sidebar-save-block"
            onClick={this.handleSaveBlock.bind(this)}
            disabled={!this.state.unsaved}
          >{ this.state.isNew ? 'Save' : 'Update' }</button>

          {!this.state.isNew ?
            <div className="delete-block">
              <button
                className="warning full-width"
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
            onClick={this.handleSaveBlock.bind(this)}
          >{ this.state.isNew ? 'Save' : 'Update' }</button>
          <Editor
            blockTitle={this.state.title}
            blockContent={this.state.content}
            language={this.state.language}
            onUpdate={handleUpdate}
          />
        </div>
        <Modal open={this.state.modalOpen} close={toggleModal}>
          <h2 className="header-lg">Are you sure?</h2>
          <p className="modal-content">
            This will permanently delete <strong>{this.state.title}</strong>.
          </p>
          <div className="fifty-fifty">
            <button
              className="full-width light-primary"
              onClick={(e) => { toggleModal(this.deleteBlock.bind(this))} }
            >Yes, Delete</button>
            <button
              className="full-width light-secondary"
              onClick={(e) => { toggleModal()} }
            >Cancel</button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

Modal.propTypes = {
  user: PropTypes.object,
};

export default Editing;