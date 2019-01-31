import * as React from 'react';
import './Editor.scss';
import Prism from 'prismjs';
import LineNumbers from './LineNumbers';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: '',
      height: 600,
    }
    this.textareaRef = React.createRef();
  }

  render() {
    const textareaChange = (e) => {
      this.setState({textarea: e.target.value});
      window.setTimeout(() => {
        const newHeight = this.textareaRef.current.nextSibling.clientHeight;
        const parentHeight = this.textareaRef.current.parentNode.clientHeight;
        this.setState({height: newHeight > parentHeight ? newHeight + 100 : parentHeight - 1});
        Prism.highlightAll();
      }, 10)
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
        />
        <LineNumbers text={this.state.textarea} />
      </div>
    );
  }
}

export default Editor;