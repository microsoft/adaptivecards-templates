import React from 'react';
import { connect } from 'react-redux';
import { Template } from 'adaptive-templating-service-typescript-node';

import { setPage } from '../../../store/page/actions';
import { RootState } from '../../../store/rootReducer';

import AdaptiveCard from '../../Common/AdaptiveCard'
import TemplateInfo from './TemplateInfo';

import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper } from './styled';

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
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
  toggleModal: () => void;
  setHeader: (header: string) => void;
}

interface State {
  templateVersion: string;
}


class PreviewModal extends React.Component<Props, State> {
  constructor(props: Props){
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
    return this.props.show && this.props.template ? (
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
              <AdaptiveCard cardtemplate={this.props.template} templateVersion={this.state.templateVersion}/>
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <TemplateInfo template={this.props.template} onClose={this.props.toggleModal} onSwitchVersion={this.toggleTemplateVersion} />
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    ) : null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewModal);
