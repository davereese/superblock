import * as React from 'react';
import PropTypes from 'prop-types';
import './Scrollbar.scss';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.scrollContainerRef = React.createRef();
    this.thumbRef = React.createRef();
  }
  
  componentDidUpdate() {
    this.setThumbHeight();
  }

  setThumbHeight() {
    const scroller = this.scrollContainerRef.current;
    const scrollerHeight = scroller.getBoundingClientRect().height;
    const thumb = this.thumbRef.current;
    const thumbHeight = scrollerHeight * scrollerHeight / scroller.scrollHeight;
    const factor = (scrollerHeight - thumbHeight)/(scroller.scrollHeight - scrollerHeight);

    if (thumbHeight === scrollerHeight) {
      thumb.style.transform = '';
      return;
    }

    thumb.scaling = factor;
    thumb.style.height = thumbHeight + 'px';
    thumb.style.transform = `
      matrix3d(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, -1
      )
      scale(${1/factor})
      translateZ(${1 - 1/factor}px)
      translateZ(-2.013px)
    `;
  }

  render() {
    let dragging = false;
    let lastY = 0;

    const dragStart = (event) => {
      dragging = true;
      this.scrollContainerRef.current.style.pointerEvents = 'none';
      this.scrollContainerRef.current.style.userSelect = 'none';
  
      lastY = (event.clientY || event.clientY === 0) ? event.clientY : event.touches[0].clientY;
    }
  
    const dragMove = (event) => {
      if (!dragging) return;
      var clientY = (event.clientY || event.clientY === 0) ? event.clientY : event.touches[0].clientY;
      this.scrollContainerRef.current.scrollTop += (clientY - lastY)/this.thumbRef.current.scaling;
      lastY = clientY;
      event.preventDefault();
    }
  
    const dragEnd = (event) => {
      dragging = false;
      this.scrollContainerRef.current.style.pointerEvents = 'initial';
      this.scrollContainerRef.current.style.userSelect = 'initial';
    }

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchmove', dragMove);
    window.addEventListener('touchend', dragEnd);

    return (
      <div
        className={`scrollContainer`}
        ref={this.scrollContainerRef}
      >
        <div
          className="scrollbar"
          ref={this.thumbRef}
          onMouseDown={dragStart}
          onTouchStart={dragStart}
        />
        {this.props.children}
      </div>
    );
  }
}

Editor.propTypes = {
  editor: PropTypes.string,
  childHeight: PropTypes.number,
  children: PropTypes.node,
};

Editor.defaultProps = {
  editor: null,
  children: null,
};

export default Editor;