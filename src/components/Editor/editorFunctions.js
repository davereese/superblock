export const getLineNumber = (value, caret) => {
  return value.substr(0, caret).split("\n").length;
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

export const firstLineChange = (oldContent, index, selectionStartPos) => {
  const oldContentArray = oldContent.split('\n');
  const firstLineFromCaret = oldContent.substr(selectionStartPos).split("\n")[0];
  let wholeLineSelected = true;
  // Check to see if the selected portion of the first line changed includes all
  // of the line or not. If it doesn't
  if (oldContentArray[index - 1] !== firstLineFromCaret) {
    wholeLineSelected = false;
  }

  return wholeLineSelected;
}

export const indentContent = (
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

export const outdentContent = (e, selectionStartLine, selectionEndLine) => {
  const oldContent = e.target.value;
  let linesArray = oldContent.split('\n');
  linesArray = linesArray.map((line, i) => {
    if (i >= selectionStartLine - 1 && i <= selectionEndLine - 1) {
      // if (line.search(/^\s\s/) !== -1) {
      //   outdentLines = outdentLines + 1;
      // }
      line = line.replace(/^\s\s/, '');
    }
    return line;
  });

  return linesArray.join('\n');
}

export const indentNewLine = (value, selectionStartLine) => {
  const contentArray = value.split('\n');

  // search the string for the amount of whitespace it has and mimic
  let numberOfSpaces = contentArray[selectionStartLine - 1].search(/\S|$/);
  const spacesString = contentArray[selectionStartLine - 1].substr(0, numberOfSpaces);

  // check if the line above ends with '{' and indent more on the new line
  const openBracketSpace = contentArray[selectionStartLine - 1].slice(-1) === '{' ? '  ' : '';
  numberOfSpaces = openBracketSpace.length === 2 ? (numberOfSpaces + 2) : numberOfSpaces;

  return spacesString + openBracketSpace;
}