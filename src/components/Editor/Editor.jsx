import * as React from 'react';
import PropTypes from 'prop-types';

import * as editor from './editorFunctions.js';

import Prism from 'prismjs';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';

import LineNumbers from './LineNumbers';
import Scrollbar from '../Scrollbar/Scrollbar';
import Block from '../Block/Block';

/* This component handles the main content editor (IDE). It takes care of the
content display, editing functionality and syntax highlighting */
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.blockTitle,
      textarea: props.blockContent,
      height: 600,
      focusLine: null,
      metaDown: false,
      shiftDown: false,
      editingTitle: false,
      customTitle: false,
    }
    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    // Set customTitle if the title initializes as something other than 'Block'
    if (this.props.blockTitle !== 'Block') {
      this.setState({customTitle: true});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.blockTitle !== this.props.blockTitle && !this.state.customTitle) {
      this.setState({title: this.props.blockTitle});
    }

    if (prevProps.language !== this.props.language) {
      Prism.highlightAll();
    }
  }

  render() {
    const textareaChange = (e) => {
      this.setState({textarea: e.target.value}, () => {
        const newHeight = this.textareaRef.current.nextSibling.clientHeight;
        const parentHeight = this.textareaRef.current.parentNode.clientHeight;
        this.setState({height: newHeight > parentHeight ? newHeight + 100 : parentHeight - 1});
        Prism.highlightAll();
      });
      // set focus
      handleFocus(e);
    }

    const handleFocus = (e) => {
      const caret = editor.getCaretPosition(e);
      if (caret.selectionStartLine === caret.selectionEndLine) {
        this.setState({focusLine: caret.selectionStartLine});
      } else {
        this.setState({focusLine: null});
      }
    }

    const handleKeyDown = (e) => {
      const caret = editor.getCaretPosition(e);
      const oldContent = JSON.parse(JSON.stringify(e.target.value));
      let newContent;

      // Do some fancy stuff if any of these keys are pressed and held down
      if (e.key === 'Shift' || e.key === 'Meta' || e.key === 'Control') {
        e.preventDefault();
        if (e.key === 'Meta' || e.key === 'Control') {
          this.setState({metaDown: true});
        } else if (e.key === 'Shift') {
          this.setState({shiftDown: true});
        }
      } else if (this.state.metaDown) {

        /** HANDLE { KEY **/
        if (e.keyCode === 219) {
          // We're trying to outdent
          e.preventDefault();
          newContent = editor.outdentContent(e, caret);
          e.target.value = newContent;
          // Retain the selection / set the caret
          e.target = editor.setCaretOrSelection('outdent', e.target, oldContent, newContent, caret);

        /** HANDLE } KEY **/
        } else if (e.keyCode === 221) {
          // We're trying to indent
          e.preventDefault();
          const override = true;
          newContent = editor.indentContent(e, caret, override);
          e.target.value = newContent;
          // Retain the selection / set the caret
          e.target = editor.setCaretOrSelection('indent', e.target, oldContent, newContent, caret);
        }
      } else if (this.state.shiftDown) {

        /** HANDLE TAB KEY SCEANRIO 1 **/
        if (e.key === 'Tab') {
          // We're trying to outdent
          e.preventDefault();
          newContent = editor.outdentContent(e, caret);
          e.target.value = newContent;
          // Retain the selection / set the caret
          e.target = editor.setCaretOrSelection('outdent', e.target, oldContent, newContent, caret);
        }

      /** HANDLE TAB KEY SCEANRIO 2 **/
      } else if (e.key === 'Tab') {
        // indent if we just hit tab key
        e.preventDefault();
        newContent = editor.indentContent(e, caret);
        e.target.value = newContent;
        // Retain the selection / set the caret
        e.target = editor.setCaretOrSelection('indent', e.target, oldContent, newContent, caret);
      }

      /** HANDLE ENTER/RETURN KEY **/
      if (e.key === 'Enter') {
        e.preventDefault();
        const spaces = editor.indentNewLine(e.target.value, caret);
        const numberOfSpaces = spaces.search(/\S|$/);
        const oldContent = e.target.value;

        newContent = oldContent.substring( 0, caret.selectionStartPos ) + '\n' + spaces +
          oldContent.substring( caret.selectionEndPos );

        e.target.value = newContent;
        // set caret position
        e.target.selectionStart = e.target.selectionEnd = caret.selectionStartPos + 1 + numberOfSpaces;
      }

      // trigger the syntax highlighting
      textareaChange(e);
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        this.setState({metaDown: false});
      } else if (e.key === 'Shift') {
        this.setState({shiftDown: false});
      }
    }

    const toggleTitle = (e) => {
      this.setState({editingTitle: !this.state.editingTitle});
    }

    const handleTitleChange = (e) => {
      this.setState({title: e.target.value});

      // Set the title as a custom one so we don't overwrite it if the language selection changes.
      if (!this.state.customTitle) {
        this.setState({customTitle: true});
      }
    }

    const handleCopy = (e) => {
      const copyText = this.textareaRef.current;
      copyText.select();
      document.execCommand("copy");
      editor.clearSelection();
      e.target.className = 'editor__copy copied';
    }

    const removeCopiedClass = (e) => {
      e.target.className = 'editor__copy';
    }

    /** DYNAMIC STYLES **/
    const textareaHeight = {
      height: `${this.state.height}px`,
    };

    return (
      <React.Fragment>
        <label className="editor__label">
        {this.state.editingTitle === true ?
          <input
            type="text"
            className="no-style"
            value={this.state.title}
            onChange={handleTitleChange}
            onBlur={toggleTitle}
          /> :
          <h1 onClick={toggleTitle}>
            {this.state.title}
          </h1>
        }
        </label>
        <div className="editor">
          <Scrollbar>
            <textarea
              className="editor__input"
              style={textareaHeight}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              ref={this.textareaRef}
              value={this.state.textarea}
              onChange={textareaChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onClick={handleFocus}
            />
            <LineNumbers
              text={this.state.textarea}
              focus={this.state.focusLine}
              syntax={this.props.language}
            />
          </Scrollbar>
          <Block color={this.props.language}>
            {this.props.language}
          </Block>
          <div
            className="editor__copy"
            onMouseDown={removeCopiedClass}
            onClick={handleCopy}
          >COPY</div>
        </div>
      </React.Fragment>
    );
  }
}

Editor.propTypes = {
  blockTitle: PropTypes.string,
  blockContent: PropTypes.string,
  language: PropTypes.string,
};

Editor.defaultProps = {
  blockTitle: '',
  blockContent: '',
  language: '',
};

export default Editor;