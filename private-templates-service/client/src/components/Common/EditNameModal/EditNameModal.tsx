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
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import {
  BackDrop,
  Modal,
  Header,
  Description,
  CancelButton,
} from '../PublishModal/styled';

import {
  EditWrapper,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateName();
  }

  const updateName = () => {
    if (name && name !== props.currentName) {
      props.updateName(name);
    }
    props.closeModal();
  }

  return (
    <BackDrop>
      <Modal aria-label={EDIT_CARD_NAME}>
        <Header>{EDIT_CARD_NAME}</Header>
        <Description>{EDIT_CARD_SUBHEADER}</Description>
        <EditWrapper onSubmit={handleSubmit} >
          <TextField value={name} onChange={onChange} />
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
