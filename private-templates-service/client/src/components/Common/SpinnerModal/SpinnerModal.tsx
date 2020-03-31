import React from 'react';
import { CenteredSpinner } from './styled';
import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { closeModal } from '../../../store/page/actions';
import { BackDrop } from '../ShareModal/styled';
import { SpinnerSize } from 'office-ui-fabric-react';

const mapStateToProps = (state: RootState) => {
  return {
    isFetching: state.currentTemplate.isFetching
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

interface Props {
  isFetching: boolean;
  closeModal: () => void;
  closeAction?: () => void;
}

class SpinnerModal extends React.Component<Props>{
  constructor(props: Props) {
    super(props);
  }
  
  componentDidUpdate(){
    if(!this.props.isFetching){
      if(this.props.closeAction){
        this.props.closeAction();
      }
      this.props.closeModal();
    }
  }

  render() {
    return (
      <BackDrop>
        <CenteredSpinner size={SpinnerSize.large}/>
      </BackDrop>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SpinnerModal);
