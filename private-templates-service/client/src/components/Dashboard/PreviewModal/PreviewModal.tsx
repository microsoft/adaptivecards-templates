import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { setPage } from '../../../store/page/actions';
import { RootState } from '../../../store/rootReducer';
import { getTemplate } from "../../../store/currentTemplate/actions";

import AdaptiveCard from '../../Common/AdaptiveCard'
import TemplateInfo from './TemplateInfo';

import { ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper, CenteredSpinner } from './styled';

import { Template } from 'adaptive-templating-service-typescript-node';

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
    isFetching: state.currentTemplate.isFetching,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage))
    },
    getTemplate: (templateID: string) => {
      dispatch(getTemplate(templateID));
    }
  }
}

interface MatchParams {
  uuid: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  template?: Template;
  isFetching?: boolean;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  getTemplate: (templateID: string) => void;
}

interface State {
  templateVersion: string;
}


class PreviewModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { templateVersion: "1.0" }
    this.props.getTemplate(this.props.match.params.uuid);
  }

  componentDidMount() {
    if (this.props.template && this.props.template.name) {
      this.props.setPage(this.props.template.name, 'Template');
    }
  }

  toggleTemplateVersion = (templateVersion: string) => {
    this.setState({ templateVersion: templateVersion });
  };

  componentDidUpdate(prevProps: Props) {
    if (!this.props.isFetching && (!this.props.template || !this.props.template.instances ||  this.props.template.instances.length === 0)) {
      const history = this.props.history;
      if (history) history.push("/");
    }
    if (prevProps.template === undefined && this.props.template && this.props.template.name) {
      this.props.setPage(this.props.template.name, 'Template');
    }
    if (prevProps.template !== this.props.template && this.props.template && this.props.template.instances
      && this.props.template.instances[0] && this.props.template.instances[0].version) {
      this.setState({ templateVersion: this.props.template.instances[0].version });
    }
  }

  render() {
    const {
      isFetching,
      template,
    } = this.props;

    return (
      <ModalWrapper>
        {template && !isFetching ?
          <React.Fragment>
            <ACPanel>
              <ACWrapper>
                <AdaptiveCard cardtemplate={template} templateVersion={this.state.templateVersion} />
              </ACWrapper>
            </ACPanel>
            <DescriptorWrapper>
              <TemplateInfo template={template} onSwitchVersion={this.toggleTemplateVersion} />
            </DescriptorWrapper>
          </React.Fragment>
          : <CenteredSpinner size={SpinnerSize.large} />
        } 
      </ModalWrapper>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PreviewModal));
