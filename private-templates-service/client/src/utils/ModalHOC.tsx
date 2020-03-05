import React from 'react';
import ReactDOM from 'react-dom';

const ModalHOC = <P extends object>(Component: React.ComponentType<P>) =>
  class modalHOC extends React.Component<P> {
    modal = document.getElementById('modal');

    render() {
      const { ...props } = this.props;
      return this.modal ? ReactDOM.createPortal(<Component {...props as P} />, this.modal) : null;
    }
  }

export default ModalHOC;
