export const getLineNumber = (value, caret) => {
  return value.substr(0, caret).split("\n").length;
}

export const getCaretPosition = (e) => {
  return {
    selectionStartPos: e.target.selectionStart,
    selectionStartLine: getLineNumber(e.target.value, e.target.selectionStart),
    selectionEndPos: e.target.selectionEnd,
    selectionEndLine: getLineNumber(e.target.value, e.target.selectionEnd),
  };
}

export const getNumberOfLinesChanged = (oldContent, newContent) => {
  const oldContentArray = oldContent.split('\n');
  const newContentArray = newContent.split('\n');
  let differences = 0;
  oldContentArray.forEach((line, i) => {
    if (newContentArray[i] !== line) {
      differences = differences + 1;
    }
  });

  return differences;
}

export const firstLineChange = (oldContent, caret) => {
  const oldContentArray = oldContent.split('\n');
  const firstLineFromCaret = oldContent.substr(caret.selectionStartPos).split("\n")[0];
  let wholeLineSelected = true;
  // Check to see if the selected portion of the first line changed includes all
  // of the line or not. If it doesn't
  if (oldContentArray[caret.selectionStartLine - 1] !== firstLineFromCaret) {
    wholeLineSelected = false;
  }

  return wholeLineSelected;
}

export const indentContent = (e, caret, override = false) => {
  const oldContent = e.target.value;
  let newContent;
  // Set the new content
  if (caret.selectionStartLine === caret.selectionEndLine && !override) {
    // single line
    newContent = oldContent.substring( 0, caret.selectionStartPos ) + "  " +
      oldContent.substring( caret.selectionEndPos );
  } else {
    // selection
    let linesArray = oldContent.split('\n');
    linesArray = linesArray.map((line, i) => {
      if (i >= caret.selectionStartLine - 1 && i <= caret.selectionEndLine - 1) {
        line = '  ' + line;
      }
      return line;
    });
    newContent = linesArray.join('\n');
  }

  return newContent;
}

export const outdentContent = (e, caret) => {
  const oldContent = e.target.value;
  let linesArray = oldContent.split('\n');
  linesArray = linesArray.map((line, i) => {
    if (i >= caret.selectionStartLine - 1 && i <= caret.selectionEndLine - 1) {
      line = line.replace(/^\s\s/, '');
    }
    return line;
  });

  return linesArray.join('\n');
}

export const indentNewLine = (value, caret) => {
  const contentArray = value.split('\n');

  // search the string for the amount of whitespace it has and mimic
  let numberOfSpaces = contentArray[caret.selectionStartLine - 1].search(/\S|$/);
  const spacesString = contentArray[caret.selectionStartLine - 1].substr(0, numberOfSpaces);

  // check if the line above ends with '{' and indent more on the new line
  const openBracketSpace = contentArray[caret.selectionStartLine - 1].slice(-1) === '{' ? '  ' : '';
  numberOfSpaces = openBracketSpace.length === 2 ? (numberOfSpaces + 2) : numberOfSpaces;

  return spacesString + openBracketSpace;
}