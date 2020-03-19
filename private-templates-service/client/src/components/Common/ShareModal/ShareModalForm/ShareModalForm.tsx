import React from 'react';

import { connect } from 'react-redux';
import { updateTemplate } from '../../../../store/currentTemplate/actions';
import { closeModal } from '../../../../store/page/actions';
import { UserType } from '../../../../store/auth/types';
import { RootState } from '../../../../store/rootReducer';

import { PrimaryButton } from 'office-ui-fabric-react';

import { EmailPanel, SemiBoldText, BottomRow, ButtonGroup, CancelButton, SendMailButton } from '../styled';
import * as STRINGS from '../../../../assets/strings';

import { Template } from 'adaptive-templating-service-typescript-node';

interface ShareModalFormProps {
  shareURL: string;
  templateVersion?: string;
  closeModal: () => void;
  shareTemplate: (version: string, isShareable: boolean) => void;
  user?: UserType;
  template?: Template;
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.user,
    template: state.currentTemplate.template
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
    shareTemplate: (version: string, isShareable: boolean) => {
      dispatch(updateTemplate(undefined, version, undefined, undefined, undefined, undefined, undefined, isShareable));
    }
  }
}

class ShareModalForm extends React.Component<ShareModalFormProps> {

  shareTemplate = () => {
    this.props.shareTemplate(this.props.templateVersion ? this.props.templateVersion : "1.0", true);
    this.props.closeModal();
  }

  render() {
    return (
      <React.Fragment>
        <EmailPanel>
          <SemiBoldText>{STRINGS.EMAIL_RECIPIENTS}</SemiBoldText>
          <SendMailButton text={STRINGS.SEND_IN_OUTLOOK} href={initMailingLink(this.props)} />
        </EmailPanel>
        <BottomRow>
          <ButtonGroup>
            <CancelButton text="Cancel" onClick={this.props.closeModal} />
            <PrimaryButton type="submit" value="Submit" text="Done" onClick={this.shareTemplate} />
          </ButtonGroup>
        </BottomRow>
      </React.Fragment>
    );
  }
}

function initMailingLink(props: ShareModalFormProps): string {
  let templateName = props.template!.name;

  const to = "";
  const subject = "ACMS: " + props.user!.displayName + " shared " + templateName + " with you";
  const body = "Here is the link to access this Adaptive Card: " + props.shareURL;

  let mailingLink = "mailto:" + to + "?subject=" + subject + "&body=" + body;

  return mailingLink.replace(" ", "%20");
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareModalForm);
