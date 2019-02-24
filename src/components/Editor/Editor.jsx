import * as React from 'react';
import PropTypes from 'prop-types';

import './Editor.scss';
import * as editor from './editorFunctions.js';
import Prism from 'prismjs';

import LineNumbers from './LineNumbers';
import Scrollbar from '../Scrollbar/Scrollbar';
import Block from '../Block/Block';

/* This component handles the main content editor (IDE). It takes care of the
content display, editing functionality and syntax highlighting */
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: props.blockContent,
      height: 600,
      focusLine: null,
      metaDown: false,
      shiftDown: false,
    }
    this.textareaRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
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

    /** DYNAMIC STYLES **/
    const textareaHeight = {
      height: `${this.state.height}px`,
    };

    return (
      <React.Fragment>
        <label className="editor__label">Block Title</label>
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
        </div>
      </React.Fragment>
    );
  }
}

Editor.propTypes = {
  blockContent: PropTypes.string,
  language: PropTypes.string,
};

Editor.defaultProps = {
  blockContent: '',
  language: '',
};

export default Editor;