import React from 'react';

import { connect } from 'react-redux';
import { updateTemplate } from '../../../../store/currentTemplate/actions';
import { closeModal } from '../../../../store/page/actions';

import { TextField, PrimaryButton } from 'office-ui-fabric-react';

import { EmailPanel, SemiBoldText, BottomRow, ButtonGroup, CancelButton } from '../styled';
import * as STRINGS from '../../../../assets/strings';

interface ShareModalFormProps {
  shareURL: string;
  templateVersion?: string;
  closeModal: () => void;
  shareTemplate: (version: string, isShareable: boolean) => void;
}

interface State {
  value: string;
}

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

class ShareModalForm extends React.Component<ShareModalFormProps, State> {

  constructor(props: ShareModalFormProps) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: any) {
    //TODO: use emails given to send an email

    this.props.shareTemplate(this.props.templateVersion ? this.props.templateVersion : "1.0", true);
    this.props.closeModal();

    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <EmailPanel>
            <SemiBoldText style={{ color: 'pink' }}>Send to recipients</SemiBoldText>
            <TextField id="emailTextField"
              value={this.state.value}
              onChange={this.handleChange}
              description={STRINGS.EMAIL_TEXTFIELD_WARNING} />
          </EmailPanel>
          <BottomRow>
            <ButtonGroup>
              <CancelButton text="Cancel" onClick={this.props.closeModal} />
              <PrimaryButton type="submit" value="Submit" text="Share" />
            </ButtonGroup>
          </BottomRow>
        </form>
      </React.Fragment>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(ShareModalForm);
