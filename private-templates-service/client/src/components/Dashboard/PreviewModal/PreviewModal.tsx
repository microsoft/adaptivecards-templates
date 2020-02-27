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
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage))
    }
  }
}

interface Props {
  show: boolean;
  template?: Template;
  toggleModal: () => void;
  setPage: (currentPageTitle: string, currentPage: string) => void;
}

class PreviewModal extends React.Component<Props, {}> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.show !== this.props.show || prevProps.template !== this.props.template) {
      this.props.setPage(
        this.props.show && this.props.template && this.props.template.name ? this.props.template.name : 'Dashboard',
        this.props.show && this.props.template && this.props.template.name ? this.props.template.name : 'Dashboard');
    }
  }

  render() {
    return this.props.show && this.props.template ? (
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
              <AdaptiveCard cardtemplate={this.props.template} />
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <TemplateInfo template={this.props.template} onClose={this.props.toggleModal} />
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    ) : null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewModal);
