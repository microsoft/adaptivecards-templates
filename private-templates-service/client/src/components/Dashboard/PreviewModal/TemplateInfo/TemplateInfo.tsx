import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../../../store/rootReducer';
import { openModal, closeModal } from '../../../../store/page/actions';
import { ModalState } from '../../../../store/page/types';
import { updateCurrentTemplateVersion } from '../../../../store/currentTemplate/actions';

import { Template, TemplateInstance, PostedTemplate } from 'adaptive-templating-service-typescript-node';

import PublishModal from '../../../Common/PublishModal';
import UnpublishModal from '../../../Common/UnpublishModal';
import Tags from '../../../Common/Tags';
import ShareModal from '../../../Common/ShareModal';

import VersionCard from './VersionCard';

import { ActionButton, IDropdownOption } from 'office-ui-fabric-react';

import { EDIT_IN_DESIGNER, DELETE, SHARE, PUBLISH, UNPUBLISH } from "../../../../assets/strings"
import { THEME } from '../../../../globalStyles';
import {
  OuterWrapper,
  HeaderWrapper,
  TopRowWrapper,
  TitleWrapper,
  Title,
  StatusIndicator,
  Status,
  TimeStamp,
  ActionsWrapper,
  MainContentWrapper,
  RowWrapper,
  Card,
  CardHeader,
  CardBody,
  IconWrapper,
  UsageNumber,
  TagsWrapper,
  StyledVersionDropdown,
  DropdownStyles,
} from './styled';

const buttons = [
  {
    text: EDIT_IN_DESIGNER,
    icon: { iconName: 'SingleColumnEdit' }
  },
  {
    text: DELETE,
    icon: { iconName: 'Delete' }
  },
  {
    text: SHARE,
    icon: { iconName: 'AddFriend' }
  },
  {
    text: PUBLISH,
    altText: UNPUBLISH,
    icon: { iconName: 'PublishContent' }
  },
];

// TODO: Dynamically show info. Backend not ready
const cards = [
  {
    header: 'Owner',
    iconName: 'Contact',
    bodyText: 'Henry Trent'
  },
  {
    header: 'Usage',
    body: (<UsageNumber>56</UsageNumber>),
    bodyText: 'Requests'
  }
];

interface Props extends RouteComponentProps {
  template: Template;
  onSwitchVersion: (templateVersion: string) => void;
  updateCurrentTemplateVersion: (template: Template, version: string) => void;
  modalState?: ModalState;
  openModal: (modalState: ModalState) => void;
  closeModal: () => void;
}

interface State {
  version: string;
}


const mapStateToProps = (state: RootState) => {
  return {
    modalState: state.page.modalState,
    version: state.currentTemplate.version
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    openModal: (modalState: ModalState) => {
      dispatch(openModal(modalState));
    },
    closeModal: () => {
      dispatch(closeModal());
    },
    updateCurrentTemplateVersion: (template: Template, version: string) => {
      dispatch(updateCurrentTemplateVersion(template, version))
    }
  }
};

function getVersion(template: Template): string {
  if (template.instances && template.instances[0] && template.instances[0].version) {
    return template.instances[0].version;
  }
  return "1.0"
}

function getTemplateState(template: Template, version: string): PostedTemplate.StateEnum {
  if (!template.instances || template.instances.length === 0) return PostedTemplate.StateEnum.Draft;
  for (let instance of template.instances) {
    if (instance.version === version) return instance.state || PostedTemplate.StateEnum.Draft;
  }
  return PostedTemplate.StateEnum.Draft;
}

class TemplateInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const currentVersion = getVersion(this.props.template);
    this.state = { version: currentVersion }
  }

  versionList = (instances: TemplateInstance[] | undefined): IDropdownOption[] => {
    if (!instances) return [];
    let options: IDropdownOption[] = [];
    for (let instance of instances) {
      if (!instance.version) continue;
      options.push({ key: instance.version, text: `Version ${instance.version}` });
    }
    return options;
  }

  onVersionChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) return;
    let version = option.key.toString();
    this.setState({ version: version });
    this.props.updateCurrentTemplateVersion(this.props.template, version);
    this.props.onSwitchVersion(version);
  }

  render() {
    const {
      isLive,
      tags,
      createdAt,
      instances,
    } = this.props.template;

    let createdAtParsed = "";

    if (createdAt) {
      const createdAtDate = new Date(createdAt);
      createdAtParsed = createdAtDate.toLocaleString();
    }

    const { history } = this.props;
    if (!history) {
      return (<div>Error loading page</div>)
    }
    let templateState = getTemplateState(this.props.template, this.state.version);
    return (
      < OuterWrapper >
        <HeaderWrapper>
          <TopRowWrapper>
            <TitleWrapper>
              <Title>
                <StyledVersionDropdown
                  placeholder={`Version ${this.state.version}`}
                  options={this.versionList(instances)}
                  onChange={this.onVersionChange}
                  theme={THEME.LIGHT}
                  styles={DropdownStyles}
                />
              </Title>
              <StatusIndicator state={templateState} />
              <Status>{PostedTemplate.StateEnum[templateState]}</Status>
            </TitleWrapper>
            <TimeStamp>
              Created {createdAtParsed}
            </TimeStamp>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map((val) => (
              <ActionButton key={val.text} iconProps={val.icon} allowDisabledFocus
                onClick={() => { onActionButtonClick(this.props, this.state, val) }}>
                {val.text === 'Publish' && templateState === PostedTemplate.StateEnum.Live ? val.altText : val.text}
              </ActionButton>
            ))}
          </ActionsWrapper>
        </HeaderWrapper>
        <MainContentWrapper>
          <RowWrapper>
            {cards.map((val) => (
              <Card key={val.header}>
                <CardHeader>
                  {val.header}
                </CardHeader>
                <CardBody>
                  {val.iconName && <IconWrapper iconName={val.iconName}></IconWrapper>}
                  {val.body}
                  {val.bodyText}
                </CardBody>
              </Card>
            ))}
          </RowWrapper>
          <Card>
            <CardHeader>Tags</CardHeader>
            <CardBody>
              <TagsWrapper>
                <Tags tags={tags} allowAddTag={true} allowEdit={true} />
              </TagsWrapper>
            </CardBody>
          </Card>
          <RowWrapper>
            <VersionCard template={this.props.template} templateVersion={this.state.version} />
          </RowWrapper>
        </MainContentWrapper>
        {this.props.modalState === ModalState.Publish && <PublishModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.Unpublish && <UnpublishModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.Share && <ShareModal template={this.props.template} templateVersion={this.state.version} />}
      </OuterWrapper>
    );
  }
}

function onActionButtonClick(props: Props, state: State, val: any) {
  let templateState = getTemplateState(props.template, state.version);

  switch (val.text) {
    case SHARE:
      props.openModal(ModalState.Share);
      break;
    case EDIT_IN_DESIGNER:
      const { history } = props;
      if (history) history.push('/designer');
      break;
    case PUBLISH:
      switch (templateState) {
        case PostedTemplate.StateEnum.Draft:
          props.openModal(ModalState.Publish);
          break;
        case PostedTemplate.StateEnum.Live:
          props.openModal(ModalState.Unpublish);
          break;
        case PostedTemplate.StateEnum.Deprecated:
          props.openModal(ModalState.Publish);
          break;
        default:
          break;
      }
    default:
      break;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TemplateInfo));
