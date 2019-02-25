const getLineNumber = (value, caret) => {
  return value.substr(0, caret).split("\n").length;
}

const isFirstLineChanged = (oldContent, newContent, caret) => {
  const oldFirstLineFromCaret = oldContent.substr(caret.selectionStartPos).split("\n")[0];
  const newFirstLineFromCaret = newContent.substr(caret.selectionStartPos).split("\n")[0];
  const changed = oldFirstLineFromCaret === newFirstLineFromCaret ? false : true;
  return changed;
}

const getNumberOfLinesChanged = (oldContent, newContent) => {
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

const isWholeFirstLineSelected = (oldContent, caret) => {
  const oldContentArray = oldContent.split('\n');
  const firstLineFromCaret = oldContent.substr(caret.selectionStartPos).split("\n")[0];
  let wholeLineSelected = true;
  // Check to see if the selected portion of the first line selected includes all
  // of the line or not.
  if (oldContentArray[caret.selectionStartLine - 1] !== firstLineFromCaret) {
    wholeLineSelected = false;
  }

  return wholeLineSelected;
}

export const getCaretPosition = (e) => {
  return {
    selectionStartPos: e.target.selectionStart,
    selectionStartLine: getLineNumber(e.target.value, e.target.selectionStart),
    selectionEndPos: e.target.selectionEnd,
    selectionEndLine: getLineNumber(e.target.value, e.target.selectionEnd),
  };
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

export const setCaretOrSelection = (direction, target, oldContent, newContent, caret) => {
  const firstLineChange = isFirstLineChanged(oldContent, newContent, caret);
  const wholeSelection = isWholeFirstLineSelected(oldContent, caret);
  // count how many lines were changed
  const linesChanged = getNumberOfLinesChanged(oldContent, newContent);
  // count the number of indents made
  const indents = direction === 'indent' ? (caret.selectionEndLine - caret.selectionStartLine) * 2 + 2 : 0;
  let startAdjustment = 0,
      endAdjustment = 0,
      outdentLines;

  // figure out all of the adjustments
  if (caret.selectionStartPos !== caret.selectionEndPos) {
    outdentLines = direction === 'outdent' ? linesChanged : 0;
    if (direction === 'outdent') {
      if (firstLineChange) {
        startAdjustment = wholeSelection ? 0 : 2;
      } else {
        startAdjustment = 0;
      }
    } else if (direction === 'indent' && linesChanged > 0) {
      startAdjustment = -2;
    }
  } else {
    outdentLines = 0;
    if (firstLineChange) {
      startAdjustment = direction === 'outdent' ? 2 : -2;
      endAdjustment = direction === 'outdent' ? -2 : 0;
    } else {
      startAdjustment = endAdjustment = 0;
    }
  }

  // Retain the selection / set the caret
  target.selectionStart = caret.selectionStartPos - startAdjustment;
  target.selectionEnd = caret.selectionEndPos - (outdentLines * 2) + indents + endAdjustment;

  return target;
}

export const clearSelection = () => {
  let sel = document.selection;
  if (sel) {
    sel.empty();
  } else {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    const activeEl = document.activeElement;
    if (activeEl) {
      let tagName = activeEl.nodeName.toLowerCase();
      if (tagName === 'textarea' || (tagName === 'input' && activeEl.type === 'text')) {
        // Collapse the selection to the end
        activeEl.selectionStart = activeEl.selectionEnd;
      }
    }
  }
}