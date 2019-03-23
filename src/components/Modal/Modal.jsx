import * as React from 'react';
import PropTypes from 'prop-types';

/* This component displays a modal with customizable text
 and buttons.
*/
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({open: this.props.open});
    }
  }

  render() {
    const closeModal = () => {
      this.props.close();
    }

    return (
      <>
        <div
          className={`modal ${this.state.open}`}
          role="dialog"
        >{this.props.children}</div>
        <div
          className={`modal-overlay ${this.state.open}`}
          onClick={closeModal}
        ></div>
      </>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  children: PropTypes.node,
};

export default Modal;