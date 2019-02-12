import * as React from 'react';
import './Editor.scss';
import Prism from 'prismjs';
import LineNumbers from './LineNumbers';
import * as editor from './editorFunctions.js';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: '',
      height: 600,
      focusLine: null,
      metaDown: false,
      shiftDown: false,
    }
    this.textareaRef = React.createRef();
  }

  render() {
    // don't want this to be in state so it updates immedately
    let outdentLines = 0;

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
      const indents = (caret.selectionEndLine - caret.selectionStartLine) * 2 + 2;
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

          // Check if the beginning of the selection is at the beginning of the line
          // If not, subtract 2 from the selection
          const change = editor.firstLineChange(e.target.value, caret);
          // Get the number of lines changed to move the end position of the selection
          outdentLines = editor.getNumberOfLinesChanged(e.target.value, newContent);

          e.target.value = newContent;
          // Retain the selection / set the caret
          const selectionAdjustment = change ? 0 : 2;
          e.target.selectionStart = caret.selectionStartPos - selectionAdjustment;
          e.target.selectionEnd = caret.selectionEndPos - (outdentLines * 2);

        /** HANDLE } KEY **/
        } else if (e.keyCode === 221) {
          // We're trying to indent
          e.preventDefault();
          const override = true;
          newContent = editor.indentContent(e, caret, override);
          e.target.value = newContent;
          // Retain the selection / set the caret
          e.target.selectionStart = caret.selectionStartPos;
          e.target.selectionEnd = caret.selectionEndPos + indents;
        }
      } else if (this.state.shiftDown) {

        /** HANDLE TAB KEY SCEANRIO 1 **/
        if (e.key === 'Tab') {
          // We're trying to outdent
          e.preventDefault();
          newContent = editor.outdentContent(e, caret);

          // Check if the beginning of the selection is at the beginning of the line
          // If not, subtract 2 from the selection
          const change = editor.firstLineChange(e.target.value, caret);
          // Get the number of lines changed to move the end position of the selection
          outdentLines = editor.getNumberOfLinesChanged(e.target.value, newContent);

          e.target.value = newContent;
          // Retain the selection / set the caret
          const selectionAdjustment = change ? 2 : 0;
          e.target.selectionStart = caret.selectionStartPos - selectionAdjustment;
          e.target.selectionEnd = caret.selectionEndPos - (outdentLines * 2);
        }

      /** HANDLE TAB KEY SCEANRIO 2 **/
      } else if (e.key === 'Tab') {
        // indent if we just hit tab key
        e.preventDefault();
        newContent = editor.indentContent(e, caret);
        e.target.value = newContent;
        if (caret.selectionStartLine === caret.selectionEndLine) {
          // single line - Set the new caret position - current position + 2 to
          // account for the new tab (doube space)
          e.target.selectionStart = e.target.selectionEnd = caret.selectionStartPos + 2;
        } else {
          // Retain the selection / set the caret
          e.target.selectionStart = caret.selectionStartPos;
          e.target.selectionEnd = caret.selectionEndPos + indents;
        }
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
      <div className={'editor'}>
        <textarea
          className={'editor__input'}
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
        />
      </div>
    );
  }
}

export default Editor;