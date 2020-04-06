import React from 'react';
import { CenteredSpinner } from './styled';
import { BackDrop } from '../ShareModal/styled';
import { SpinnerSize } from 'office-ui-fabric-react';

class SpinnerModal extends React.Component{
  render() {
    return (
      <BackDrop>
        <CenteredSpinner size={SpinnerSize.large}/>
      </BackDrop>
    );
  }
}

export default SpinnerModal;
