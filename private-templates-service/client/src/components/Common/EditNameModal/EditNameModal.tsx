import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { closeModal } from '../../../store/page/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';

import {
  EDIT_CARD_NAME,
  EDIT_CARD_SUBHEADER,
  CANCEL,
  SAVE,
} from '../../../assets/strings';

import { PrimaryButton } from 'office-ui-fabric-react';

import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  CancelButton,
} from '../PublishModal/styled';

import {
  EditWrapper,
  StyledInput,
  ButtonGroup,
} from './styled';

const mapStateToProps = (state: RootState) => {
  return {
    currentName: state.currentTemplate.templateName,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
    updateName: (name: string) => {
      dispatch(updateTemplate(undefined, undefined, undefined, undefined, name))
    }
  }
}

interface Props {
  currentName?: string;
  closeModal: () => void;
  updateName: (name: string) => void;
}

const EditNameModal = (props: Props) => {
  const [name, setName] = useState(props.currentName);

  const onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setName(newValue || '');
  }

  const updateName = () => {
    if (name) {
      props.updateName(name);
    }
    props.closeModal();
  }

  return (
    <BackDrop>
      <Modal>
        <Header>{EDIT_CARD_NAME}</Header>
        <Description>{EDIT_CARD_SUBHEADER}</Description>
        <EditWrapper onSubmit={updateName} >
          <StyledInput value={name} onChange={onChange} />
        </EditWrapper>
        <ButtonGroup>
          <CancelButton text={CANCEL} onClick={props.closeModal} />
          <PrimaryButton text={SAVE} onClick={updateName} />
        </ButtonGroup>
      </Modal>
    </BackDrop>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EditNameModal);
