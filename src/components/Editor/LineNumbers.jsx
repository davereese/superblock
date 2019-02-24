import React from 'react';
import PropTypes from 'prop-types';
import "./prism.scss";
import './Editor.scss';

/* This component just renders line numbers based on a single number
of lines given in a prop */
function LineNumbers({
  text,
  focus,
  syntax,
}) {
  let linesArray = text.split('\n');

  return (
    <div className="editor__lines-container">
      {linesArray.map((line, index) => {
        if (line !== undefined) {
          const lineFocus = focus - 1 === index ? 'focus' : '';
          return (<div
              key={index}
              className={`editor__line ${lineFocus}`}
            >
              <pre className={`language-${syntax}`}><code className={`language-${syntax}`}>{line}</code></pre>
            </div>);
        }
        return null;
      })}
    </div>
  );
}

LineNumbers.propTypes = {
  text: PropTypes.string,
  focus: PropTypes.number,
  syntax: PropTypes.string,
};

LineNumbers.defaultProps = {
  text: '',
  focus: null,
  syntax: '',
};

export default LineNumbers;