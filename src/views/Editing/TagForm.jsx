import * as React from 'react';
import PropTypes from 'prop-types';

function TagForm({
  tags,
  alterTags,
}) {
  let tagInputRef = React.createRef();

  const handleAddTag = (e) => {
    if (tagInputRef.current.value) {
      tags.push(tagInputRef.current.value);
      alterTags(tags);
    }
  }

  const handleDeleteTag = (index) => {
    tags.splice(index, 1);
    alterTags(tags);
  }

  return (
    <>
      <label htmlFor="newtag">Tag</label><br />
      <div className="input-and-button">
        <input
          type="text"
          id="newtag"
          ref={tagInputRef}
        />
        <button type="button" onClick={handleAddTag}>+</button>
      </div>
      {tags.length > 0 ?
        <ul className="tagsList">
          {tags.map((tag, index) => {
            return (
              <li className="tagsList__tag" key={index}>
                {tag}
                <button
                  className="no-button close-button"
                  onClick={(e) => {handleDeleteTag(index)}}
                ></button>
              </li>
            );
          })}
        </ul>
        : null
      }
    </>
  );
}

TagForm.propTypes = {
  tags: PropTypes.array,
  alterTags: PropTypes.func,
};


export default TagForm;