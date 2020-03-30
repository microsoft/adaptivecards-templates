import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../../../store/rootReducer';
import { openModal, closeModal } from '../../../../store/page/actions';
import { ModalState } from '../../../../store/page/types';
import { updateCurrentTemplateVersion, updateTemplateTags } from '../../../../store/currentTemplate/actions';

import { Template, TemplateInstance, PostedTemplate } from 'adaptive-templating-service-typescript-node';

import { getLatestVersion } from "../../../../utils/TemplateUtil";

import { getOwnerName, getOwnerProfilePicture } from "../../../../store/templateOwner/actions";
import { OwnerType } from "../../../../store/templateOwner/types";
import OwnerAvatar from "../../RecentlyViewed/OwnerAvatar";

import PublishModal from '../../../Common/PublishModal';
import UnpublishModal from '../../../Common/UnpublishModal';
import Tags from '../../../Common/Tags';
import ShareModal from '../../../Common/ShareModal';
import EditNameModal from '../../../Common/EditNameModal';
import DeleteModal from '../../../Common/DeleteModal';
import VersionCard from './VersionCard';

import { IDropdownOption, ActionButton } from 'office-ui-fabric-react';
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

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
  CenteredSpinner,
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
  updateTags: (tags: string[]) => void;
  isFetchingTags: boolean;
  getOwnerName: (oID: string) => void;
  getOwnerProfilePicture: (oID: string) => void;
  owner?: OwnerType;
}

const mapStateToProps = (state: RootState) => {
  return {
    modalState: state.page.modalState,
    version: state.currentTemplate.version,
    isFetchingTags: state.currentTemplate.isFetchingTags,
    owner: state.templateOwner.owners,
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
    },
    updateTags: (tags: string[]) => {
      dispatch(updateTemplateTags(tags))
    },
    getOwnerName: (oid: string) => {
      dispatch(getOwnerName(oid));
    },
    getOwnerProfilePicture: (oid: string) => {
      dispatch(getOwnerProfilePicture(oid));
    }
  }
};

function getTemplateInstance(template: Template, version: string): TemplateInstance {
  for (let instance of template.instances!) {
    if (instance.version === version) return instance;
  }
  return template.instances![0];
}

interface State {
  version: string
}

class TemplateInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const currentVersion = getLatestVersion(this.props.template);
    this.state = { version: currentVersion }
    let templateInstance = getTemplateInstance(this.props.template, currentVersion);
    this.props.getOwnerName(templateInstance.lastEditedUser!);
    this.props.getOwnerProfilePicture(templateInstance.lastEditedUser!);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    let templateInstance = getTemplateInstance(this.props.template, this.state.version);
    if (this.state.version !== prevState.version && templateInstance.lastEditedUser){
      this.props.getOwnerName(templateInstance.lastEditedUser!);
      this.props.getOwnerProfilePicture(templateInstance.lastEditedUser!);
    }
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
  saveTags = (tags: string[]) => {
    this.props.updateTags(tags);
  }

  tagRemove = (tag: string) => {
    if (this.props.template.tags) {
      const newTags = this.props.template.tags.filter((existingTag: string) => existingTag !== tag);
      this.props.updateTags(newTags);
    }
  }

  render() {
    const {
      tags,
      updatedAt,
      instances,
    } = this.props.template;
    const { isFetchingTags } = this.props;

    let timestampParsed = "";
    if (updatedAt) {
      const tempDate = new Date(updatedAt);
      timestampParsed = tempDate.toLocaleString();
    }

    const { history } = this.props;
    if (!history) {
      return (<div>Error loading page</div>)
    }
    let templateInstance = getTemplateInstance(this.props.template, this.state.version);
    let templateState = templateInstance.state || PostedTemplate.StateEnum.Draft;
    return (
      <OuterWrapper>
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
                  ariaLabel="Version List Dropdown"
                  tabIndex={this.props.modalState ? -1 : 0}
                />
              </Title>
              <StatusIndicator state={templateState} />
              <Status>{PostedTemplate.StateEnum[templateState]}</Status>
            </TitleWrapper>
            <TimeStamp>
              Updated {timestampParsed}
            </TimeStamp>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map((val) => (
              <ActionButton key={val.text} iconProps={val.icon} allowDisabledFocus
                onClick={() => { onActionButtonClick(this.props, this.state, val) }}
                tabIndex={this.props.modalState ? -1 : 0}>
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
                  {val.iconName && <IconWrapper><OwnerAvatar sizeInPx={50} oID={templateInstance.lastEditedUser!}/></IconWrapper>}
                  {val.header === "Usage" && <UsageNumber>{templateInstance.numHits}</UsageNumber>}
                  {(val.header === "Owner")? (this.props.owner && this.props.owner.displayNames) ? this.props.owner.displayNames[templateInstance.lastEditedUser!] : "" : val.bodyText}
                </CardBody>
              </Card>
            ))}
          </RowWrapper>
          <Card>
            <CardHeader>Tags</CardHeader>
            <CardBody>
              <TagsWrapper>
                {isFetchingTags ?
                  <CenteredSpinner size={SpinnerSize.large} />
                  : <Tags updateTags={this.saveTags} tagRemove={this.tagRemove} tags={tags} allowAddTag={true} allowEdit={true} />
                }
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
        {this.props.modalState === ModalState.Delete && <DeleteModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.EditName && <EditNameModal />}
      </OuterWrapper>
    );
  }
}

function onActionButtonClick(props: Props, state: State, val: any) {
  let templateState = getTemplateInstance(props.template, state.version).state || PostedTemplate.StateEnum.Draft;

  switch (val.text) {
    case SHARE:
      props.openModal(ModalState.Share);
      break;
    case EDIT_IN_DESIGNER:
      const { history } = props;
      if (history) history.push('/designer');
      break;
    case DELETE:
      props.openModal(ModalState.Delete);
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
      break;
    default:
      break;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TemplateInfo));
