import React from 'react';

import { connect } from 'react-redux';
import { closeModal } from '../../../../store/page/actions';

import { Template } from 'adaptive-templating-service-typescript-node';

import { PrimaryButton } from 'office-ui-fabric-react';

import * as STRINGS from '../../../../assets/strings';

import { BackDrop, Modal, Header, Description, BottomRow, ButtonGroup } from '../styled';
import { DescriptionAccent } from '../../PublishModal/styled';

interface Props {
  template: Template;
  templateVersion: string;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class ShareSuccessModal extends React.Component<Props> {
  render() {
    return (
      <BackDrop>
        <Modal aria-label={STRINGS.SUCCESSFULLY_SHARED}>
          <Header>{STRINGS.SUCCESSFULLY_SHARED}</Header>
          <Description>
            {STRINGS.SHARE_SUCCESS_DESC}
            <DescriptionAccent>
              {this.props.template.name} - {this.props.templateVersion}
            </DescriptionAccent>
          </Description>
          <BottomRow>
            <ButtonGroup>
              <PrimaryButton text={STRINGS.OKAY_BUTTON} onClick={this.props.closeModal} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(() => { }, mapDispatchToProps)(ShareSuccessModal);
