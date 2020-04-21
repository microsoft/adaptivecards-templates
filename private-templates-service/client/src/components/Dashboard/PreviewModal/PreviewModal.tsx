import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TooltipHost } from 'office-ui-fabric-react';
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import CortanaSkills from 'adaptivecards-designer/lib/hostConfigs/cortana-skills.json';
import TeamsDark from 'adaptivecards-designer/lib/hostConfigs/microsoft-teams-dark.json';
import TeamsLight from 'adaptivecards-designer/lib/hostConfigs/microsoft-teams-light.json';
import OutlookDesktop from 'adaptivecards-designer/lib/hostConfigs/outlook-desktop.json';
import Default from 'adaptivecards-designer/lib/hostConfigs/sample.json';
import Skype from 'adaptivecards-designer/lib/hostConfigs/skype.json';
import Webchat from 'adaptivecards-designer/lib/hostConfigs/webchat.json';
import WindowsNotification from 'adaptivecards-designer/lib/hostConfigs/windows-notification.json';
import WindowsTimeline from 'adaptivecards-designer/lib/hostConfigs/windows-timeline.json';

import { setPage } from '../../../store/page/actions';
import { RootState } from '../../../store/rootReducer';
import { getTemplate } from "../../../store/currentTemplate/actions";

import { getLatestVersion } from "../../../utils/TemplateUtil";

import AdaptiveCard from '../../Common/AdaptiveCard'
import TemplateInfo from './TemplateInfo';
import requireAuthentication from '../../../utils/requireAuthentication';

import * as STRINGS from '../../../assets/strings';
import { ModalWrapper, ACOuterPanel, StyledDropdown, ACPanel, ACWrapper, DescriptorWrapper, CenteredSpinner, TooltipContainer } from './styled';

import { Template } from 'adaptive-templating-service-typescript-node';
import { ModalState } from '../../../store/page/types';

const DropdownOptions = [
  { key: 'sample', text: 'Default', value: Default },
  { key: 'cortana-skills', text: 'Cortana Skills', value: CortanaSkills },
  { key: 'microsoft-teams-dark', text: 'Microsoft Teams - Dark', value: TeamsDark },
  { key: 'microsoft-teams-light', text: 'Microsoft Teams - Light', value: TeamsLight },
  { key: 'outlook-desktop', text: 'Outlook Desktop', value: OutlookDesktop },
  { key: 'skype', text: 'Skype', value: Skype },
  { key: 'webchat', text: 'Webchat', value: Webchat },
  { key: 'windows-notification', text: 'Windows Notification', value: WindowsNotification },
  { key: 'windows-timeline', text: 'Windows Timeline', value: WindowsTimeline }
];

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
    isFetching: state.currentTemplate.isFetching,
    modalState: state.page.modalState
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
  modalState?: ModalState
}

interface State {
  templateVersion: string;
  selectedItem: { key: string, text: string, value: any };
}


class PreviewModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      templateVersion: getLatestVersion(this.props.template),
      selectedItem: { key: 'sample', text: 'Default', value: Default },
    };

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
    if (!this.props.isFetching && (!this.props.template || !this.props.template.instances || this.props.template.instances.length === 0)) {
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

  hostConfigChange = (event: React.FormEvent<HTMLDivElement>, item: any) => {
    this.setState({ selectedItem: item });
  }

  render() {
    const {
      isFetching,
      template,
    } = this.props;

    const {
      selectedItem
    } = this.state;

    return (
      <ModalWrapper>
        {template && !isFetching ?
          <React.Fragment>
            <ACOuterPanel aria-label={STRINGS.ADAPTIVE_CARD_RENDER}>
              <TooltipContainer>
                <TooltipHost content={STRINGS.HOST_CONFIG_TOOLTIP} >
                  <StyledDropdown selectedKey={selectedItem.key}
                    onChange={this.hostConfigChange}
                    options={DropdownOptions}
                    tabIndex={this.props.modalState ? -1 : 0} />
                </TooltipHost>
              </TooltipContainer>
              <ACPanel>
                <ACWrapper>
                  <AdaptiveCard cardtemplate={template} templateVersion={this.state.templateVersion} hostConfig={selectedItem.value} />
                </ACWrapper>
              </ACPanel>
            </ACOuterPanel>
            <DescriptorWrapper aria-label={STRINGS.TEMPLATE_INFO}>
              <TemplateInfo template={template} onSwitchVersion={this.toggleTemplateVersion} />
            </DescriptorWrapper>
          </React.Fragment>
          : <CenteredSpinner size={SpinnerSize.large} />
        }
    </ModalWrapper>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(withRouter(PreviewModal)));
