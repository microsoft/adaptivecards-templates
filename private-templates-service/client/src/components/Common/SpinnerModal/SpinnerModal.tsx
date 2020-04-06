import React from 'react';
import { CenteredSpinner, Dot } from './styled';
import { BackDrop } from '../ShareModal/styled';
import { SpinnerSize } from 'office-ui-fabric-react';

class SpinnerModal extends React.Component{
  render() {
    return (
      <BackDrop>
        <Dot>
          <CenteredSpinner size={SpinnerSize.large}/>
        </Dot>
      </BackDrop>
    );
  }
}

export default SpinnerModal;
