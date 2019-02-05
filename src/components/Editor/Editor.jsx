import * as React from 'react';
import './Editor.scss';
import Prism from 'prismjs';
import LineNumbers from './LineNumbers';

function getLineNumber(value, caret) {
  return value.substr(0, caret).split("\n").length;
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: '',
      height: 600,
      metaDown: false
    }
    this.textareaRef = React.createRef();
  }

  render() {
    // don't want this to be in state so it updates immediately
    let outdentLines = 0;

    const indentContent = (
      e,
      selectionStartPos,
      selectionStartLine,
      selectionEndPos,
      selectionEndLine,
      override = false
    ) => {
      const oldContent = e.target.value;
      let newContent;
      // Set the new content
      if (selectionStartLine === selectionEndLine && !override) {
        // single line
        newContent = oldContent.substring( 0, selectionStartPos ) + "  " +
        oldContent.substring( selectionEndPos );
      } else {
        // selection
        let linesArray = oldContent.split('\n');
        linesArray = linesArray.map((line, i) => {
          if (i >= selectionStartLine - 1 && i <= selectionEndLine - 1) {
            line = '  ' + line;
          }
          return line;
        });
        newContent = linesArray.join('\n');
      }

      return newContent;
    }

    const outdentContent = (
      e,
      selectionStartLine,
      selectionEndLine,
    ) => {
      const oldContent = e.target.value;
      let newContent;
      let linesArray = oldContent.split('\n');
      linesArray = linesArray.map((line, i) => {
        if (i >= selectionStartLine - 1 && i <= selectionEndLine - 1) {
          if (line.search(/^\s\s/) !== -1) {
            outdentLines = outdentLines + 1;
          }
          line = line.replace(/^\s\s/, '');
        }
        return line;
      });
      newContent = linesArray.join('\n');
      return newContent;
    }

    const textareaChange = (e) => {
      this.setState({textarea: e.target.value}, () => {
        const newHeight = this.textareaRef.current.nextSibling.clientHeight;
        const parentHeight = this.textareaRef.current.parentNode.clientHeight;
        this.setState({height: newHeight > parentHeight ? newHeight + 100 : parentHeight - 1});
        Prism.highlightAll();
      });
    }

    const handleKeyDown = (e) => {
      const selectionStartPos = e.target.selectionStart;
      const selectionStartLine = getLineNumber(e.target.value, selectionStartPos);
      const selectionEndPos = e.target.selectionEnd;
      const selectionEndLine = getLineNumber(e.target.value, selectionEndPos);
      const indents = (selectionEndLine - selectionStartLine) * 2 + 2;
      let newContent;

      // Do some fancy stuff if any of these keys are pressed and held down
      if (e.key === 'Shift' || e.key === 'Meta' || e.key === 'Control') {
        e.preventDefault();
        this.setState({metaDown: true});
      } else if (this.state.metaDown) {
        if (e.key === 'Tab' || e.keyCode === 219) {
          // We're trying to outdent
          e.preventDefault();
          newContent = outdentContent(e, selectionStartLine, selectionEndLine);
          e.target.value = newContent;
          // Retain the selection
          e.target.selectionStart = selectionStartPos;
          e.target.selectionEnd = selectionEndPos - (outdentLines * 2);
        } else if (e.keyCode === 221) {
          // We're trying to indent
          e.preventDefault();
          const override = true;
          newContent = indentContent(
            e,
            selectionStartPos,
            selectionStartLine,
            selectionEndPos,
            selectionEndLine,
            override
          );
          e.target.value = newContent;
          // Retain the selection
          e.target.selectionStart = selectionStartPos + indents;
          e.target.selectionEnd = selectionEndPos + indents;
        }
      } else if (e.key === 'Tab') {
        // indent if we just hit tab key
        e.preventDefault();
        newContent = indentContent(
          e,
          selectionStartPos,
          selectionStartLine,
          selectionEndPos,
          selectionEndLine
        );
        e.target.value = newContent;
        if (selectionStartLine === selectionEndLine) {
          // single line - Set the new cursor position - current position + 2 to
          // account for the new tab (doube space)
          e.target.selectionStart = e.target.selectionEnd = selectionStartPos + 2;
        } else {
          // selection
          // Retain the selection
          e.target.selectionStart = selectionStartPos;
          e.target.selectionEnd = selectionEndPos + indents;
        }
      }
      textareaChange(e);
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Shift' || e.key === 'Meta' || e.key === 'Control') {
        this.setState({metaDown: false});
      }
    }

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
        />
        <LineNumbers text={this.state.textarea} />
      </div>
    );
  }
}

export default Editor;