import React from 'react';
import { connect } from 'react-redux';
import { Template } from 'adaptive-templating-service-typescript-node';

import { setPage } from '../../../store/page/actions';
import { RootState } from '../../../store/rootReducer';

import AdaptiveCard from '../../Common/AdaptiveCard'
import TemplateInfo from './TemplateInfo';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper, CenteredSpinner } from './styled';

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
    isFetching: state.currentTemplate.isFetching,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setHeader: (header: string) => {
      dispatch(setPage(header))
    }
  }
}

interface Props {
  show: boolean;
  template?: Template;
  isFetching?: boolean;
  toggleModal: () => void;
  setHeader: (header: string) => void;
}

interface State {
  templateVersion: string;
}


class PreviewModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { templateVersion: "1.0" }
  }

  toggleTemplateVersion = (templateVersion: string) => {
    this.setState({ templateVersion: templateVersion });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.show !== this.props.show || prevProps.template !== this.props.template) {
      this.props.setHeader(
        this.props.show && this.props.template && this.props.template.name ?
          this.props.template.name : 'Dashboard'
      );
    }
  }

  render() {

    const {
      show,
      isFetching,
      template,
    } = this.props;

    return show ? (
      <ModalBackdrop>
        <ModalWrapper>
          {template && !isFetching ?
            <React.Fragment>
              <ACPanel>
                <ACWrapper>
                  <AdaptiveCard cardtemplate={template} templateVersion={this.state.templateVersion} />
                </ACWrapper>
              </ACPanel>
              <DescriptorWrapper>
                <TemplateInfo template={template} onClose={this.props.toggleModal} onSwitchVersion={this.toggleTemplateVersion} />
              </DescriptorWrapper>
            </React.Fragment>
            : <CenteredSpinner size={SpinnerSize.large} />
          }
        </ModalWrapper>
      </ModalBackdrop>
    ) : null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewModal);
