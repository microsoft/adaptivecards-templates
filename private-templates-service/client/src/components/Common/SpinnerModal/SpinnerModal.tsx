import React from 'react';
import { CenteredSpinner, Dot } from './styled';
import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { BackDrop } from '../ShareModal/styled';
import { SpinnerSize } from 'office-ui-fabric-react';

const mapStateToProps = (state: RootState) => {
  return {
    isFetching: state.currentTemplate.isFetching
  }
}

interface Props {
  isFetching: boolean;
}

class SpinnerModal extends React.Component<Props>{
  constructor(props: Props) {
    super(props);
  }

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

export default connect(mapStateToProps)(SpinnerModal);
