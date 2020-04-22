import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../../../store/rootReducer';
import { openModal, closeModal } from '../../../../store/page/actions';
import { addFavoriteTags, removeFavoriteTags, getAllTags } from '../../../../store/tags/actions';
import { TagsState } from '../../../../store/tags/types';
import { ModalState } from '../../../../store/page/types';
import { updateCurrentTemplateVersion, updateTemplateTags } from '../../../../store/currentTemplate/actions';

import { Template, TemplateInstance, PostedTemplate } from 'adaptive-templating-service-typescript-node';

import { getLatestVersion } from "../../../../utils/TemplateUtil";

import { getOwnerName, getOwnerProfilePicture } from "../../../../store/templateOwner/actions";
import { OwnerType } from "../../../../store/templateOwner/types";
import OwnerAvatar from "../../TemplateList/OwnerAvatar";
import OwnerList from "./OwnerList";

import PublishModal from '../../../Common/PublishModal';
import UnpublishModal from '../../../Common/UnpublishModal';
import Tags from '../../../Common/Tags';
import ShareModal from '../../../Common/ShareModal';
import ShareSuccessModal from '../../../Common/ShareModal/ShareSuccessModal';
import EditNameModal from '../../../Common/EditNameModal';
import DeleteModal from '../../../Common/DeleteModal';
import VersionCard from './VersionCard';

import { IDropdownOption, ActionButton, TooltipHost, IIconProps } from 'office-ui-fabric-react';
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { THEME } from '../../../../globalStyles';
import {
  EDIT_IN_DESIGNER,
  DELETE,
  SHARE,
  PUBLISH,
  UNPUBLISH,
  EDIT_IN_DESIGNER_TOOLTIP,
  DELETE_BUTTON_TOOLTIP,
  SHARE_BUTTON_TOOLTIP,
  PUBLISH_BUTTON_TOOLTIP,
  UNPUBLISH_BUTTON_TOOLTIP,
  TAGS,
  USAGE,
  TEMPLATE_INFO_VERSION,
  ERROR_LOADING_PAGE,
  VERSION_LIST_DROPDOWN,
  TEMPLATE_INFO_UPDATED,
  REQUESTS,
  TEMPLATE_AUTHOR,
  PEOPLE,
  TEMPLATE_AT,
  COLLABORATORS,
  COLLABORATOR,
  MANAGE,
  MANAGE_BUTTON_TOOLTIP,
  NEW_VERSION,
  NEW_VERSION_BUTTON_TOOLTIP
} from "../../../../assets/strings";
import { TooltipContainer } from '../styled';
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
import { getState } from '../../../../utils/stringUtils';

const buttons = [
  {
    text: EDIT_IN_DESIGNER,
    altText: NEW_VERSION,
    icon: { iconName: 'SingleColumnEdit' },
    altIcon: { iconName: 'CalculatorAddition' },
    tooltip: EDIT_IN_DESIGNER_TOOLTIP,
    altTooltip: NEW_VERSION_BUTTON_TOOLTIP
  },
  {
    text: MANAGE,
    icon: { iconName: 'Settings' },
    tooltip: MANAGE_BUTTON_TOOLTIP
  },
  {
    text: DELETE,
    icon: { iconName: 'Delete' },
    tooltip: DELETE_BUTTON_TOOLTIP
  },
  {
    text: SHARE,
    icon: { iconName: 'AddFriend' },
    tooltip: SHARE_BUTTON_TOOLTIP
  },
  {
    text: PUBLISH,
    altText: UNPUBLISH,
    icon: { iconName: 'PublishContent' },
    altIcon: { iconName: 'PublishContent' },
    tooltip: PUBLISH_BUTTON_TOOLTIP,
    altTooltip: UNPUBLISH_BUTTON_TOOLTIP
  },
];

const cards = [
  {
    header: TEMPLATE_AUTHOR,
    iconName: 'Contact'
  },
  {
    header: PEOPLE,
    bodyText: COLLABORATORS
  },
  {
    header: USAGE,
    bodyText: REQUESTS
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
  isFetchingOwnerName: boolean;
  isFetchingOwnerPic: boolean;
  getOwnerName: (oID: string) => void;
  getOwnerProfilePicture: (oID: string) => void;
  onAddFavoriteTag: (tag: string) => void;
  onRemoveFavoriteTag: (tag: string) => void;
  owner?: OwnerType;
  allTags: TagsState;
  getTags: () => void;
}

const mapStateToProps = (state: RootState) => {
  return {
    modalState: state.page.modalState,
    version: state.currentTemplate.version,
    isFetchingTags: state.currentTemplate.isFetchingTags,
    owner: state.templateOwner.owners,
    isFetchingOwnerName: state.templateOwner.isFetchingName,
    isFetchingOwnerPic: state.templateOwner.isFetchingPicture,
    allTags: state.tags
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
    },
    onAddFavoriteTag: (tag: string) => {
      dispatch(addFavoriteTags(tag))
    },
    onRemoveFavoriteTag: (tag: string) => {
      dispatch(removeFavoriteTags(tag))
    },
    getTags: () => {
      dispatch(getAllTags());
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
  version: string;
}

class TemplateInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const currentVersion = getLatestVersion(this.props.template);
    this.state = { version: currentVersion }
    let alreadySent = new Set();
    for (let instance of this.props.template.instances || []) {
      if (!(alreadySent.has(instance.lastEditedUser!))) {
        alreadySent.add(instance.lastEditedUser!);
        this.props.getOwnerName(instance.lastEditedUser!);
        this.props.getOwnerProfilePicture(instance.lastEditedUser!);
      }
    }
    this.props.getTags();
  }

  versionList = (instances: TemplateInstance[] | undefined): IDropdownOption[] => {
    if (!instances) return [];
    let options: IDropdownOption[] = [];
    for (let instance of instances) {
      if (!instance.version) continue;
      options.push({ key: instance.version, text: `${TEMPLATE_INFO_VERSION} ${instance.version}` });
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

  onSwitchVersion = (version: string) => {
    this.setState({ version: version });
    this.props.onSwitchVersion(version);
  }

  tooltipButton = (val: any, templateState: PostedTemplate.StateEnum) => {
    const tooltipID = val.text.replace(" ", "_").trim();
    let text: string = "";
    let tooltip: string = "";
    let icon: IIconProps = {};
    if (val.text === PUBLISH || val.text === EDIT_IN_DESIGNER) {
      text = templateState === PostedTemplate.StateEnum.Live ? val.altText : val.text;
      tooltip = templateState === PostedTemplate.StateEnum.Live ? val.altTooltip : val.tooltip;
      icon = templateState === PostedTemplate.StateEnum.Live ? val.altIcon : val.icon;
    } else if (val.text === MANAGE && templateState !== PostedTemplate.StateEnum.Live) {
      return null;
    } else {
      text = val.text;
      tooltip = val.tooltip;
      icon = val.icon;
    }
    return (
      <TooltipContainer key={val.text}>
        <TooltipHost id={tooltipID} content={tooltip}>
          <ActionButton key={text}
            iconProps={icon}
            allowDisabledFocus
            onClick={() => { onActionButtonClick(this.props, this.state, val) }}
            tabIndex={this.props.modalState ? -1 : 0}
            ariaDescription={tooltipID}>
            {text}
          </ActionButton>
        </TooltipHost>
      </TooltipContainer>
    );
  }

  render() {

    const {
      tags,
      instances,
    } = this.props.template;
    const { isFetchingTags, isFetchingOwnerName, isFetchingOwnerPic, allTags } = this.props;

    let templateInstance = getTemplateInstance(this.props.template, this.state.version);
    let templateState = templateInstance.state || PostedTemplate.StateEnum.Draft;
    let timestampParsed = "";
    if (templateInstance.updatedAt) {
      const tempDate = new Date(templateInstance.updatedAt);
      timestampParsed = tempDate.toLocaleDateString() + TEMPLATE_AT + tempDate.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    }
    let oids = new Set();
    for (let instance of this.props.template.instances || []) {
      if (instance.lastEditedUser) {
        oids.add(instance.lastEditedUser!);
      }
    }

    let isDoneFetching = false;
    if (this.props.owner && this.props.owner!.imageURLs!) {
      isDoneFetching = (Object.keys(this.props.owner.imageURLs!).length === oids.size);
    }

    const { history } = this.props;
    if (!history) {
      return (<div>{ERROR_LOADING_PAGE}</div>)
    }
    let favoriteTags: string[] = [];
    if (!allTags.isFetching && allTags.allTags && allTags?.allTags.favoriteTags) {
      favoriteTags = allTags.allTags.favoriteTags;
    }
    let tagCardID = "Card tags";
    return (
      <OuterWrapper>
        <HeaderWrapper>
          <TopRowWrapper>
            <TitleWrapper>
              <Title>
                <StyledVersionDropdown
                  placeholder={`${TEMPLATE_INFO_VERSION} ${this.state.version}`}
                  options={this.versionList(instances)}
                  onChange={this.onVersionChange}
                  theme={THEME.LIGHT}
                  styles={DropdownStyles}
                  ariaLabel={VERSION_LIST_DROPDOWN}
                  tabIndex={this.props.modalState ? -1 : 0}
                />
              </Title>
              <StatusIndicator state={templateState} />
              <Status>{getState(PostedTemplate.StateEnum[templateState])}</Status>
            </TitleWrapper>
            <TimeStamp>
              {TEMPLATE_INFO_UPDATED} {timestampParsed}
            </TimeStamp>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map((val) => this.tooltipButton(val, templateState))}
          </ActionsWrapper>
        </HeaderWrapper>
        <MainContentWrapper>
          <RowWrapper>
            {cards.map((val) => (
              <Card key={val.header} aria-label={val.header}>
                <CardHeader>
                  {val.header}
                </CardHeader>
                <CardBody>
                  {val.iconName && ((isFetchingOwnerName || isFetchingOwnerPic) ?
                    <CenteredSpinner size={SpinnerSize.large} /> :
                    <IconWrapper><OwnerAvatar sizeInPx={50} oID={templateInstance.lastEditedUser!} /></IconWrapper>)}
                  {val.header === PEOPLE && ((isFetchingOwnerName || isFetchingOwnerPic || !isDoneFetching) ?
                    <CenteredSpinner size={SpinnerSize.large} /> :
                    <IconWrapper><OwnerList oids={Array.from(oids) as string[]} /></IconWrapper>)}
                  {val.header === USAGE && <UsageNumber>{templateInstance.numHits}</UsageNumber>}
                  {(val.header === TEMPLATE_AUTHOR) ? (this.props.owner && this.props.owner.displayNames) ? this.props.owner.displayNames[templateInstance.lastEditedUser!] : "" :
                    (val.header === PEOPLE) ? oids.size + " " + (oids.size === 1 ? COLLABORATOR : val.bodyText) : val.bodyText}
                </CardBody>
              </Card>
            ))}
          </RowWrapper>
          <Card aria-label={TAGS}>
            <form aria-labelledby={tagCardID}>
              <CardHeader id={tagCardID} style={{ alignItems: "flex-start", paddingLeft: "2.5rem" }}>{TAGS}</CardHeader>
              <CardBody style={{ alignItems: "flex-start" }}>
                <TagsWrapper>
                  {isFetchingTags ?
                    <CenteredSpinner size={SpinnerSize.large} />
                    : <Tags updateTags={this.saveTags} allowSetFavorite={true} favoriteTags={favoriteTags} onAddFavoriteTag={this.props.onAddFavoriteTag} onRemoveFavoriteTag={this.props.onRemoveFavoriteTag} tagRemove={this.tagRemove} tags={tags} allowAddTag={true} allowEdit={true} />
                  }
                </TagsWrapper>
              </CardBody>
            </form>
          </Card>
          <VersionCard template={this.props.template} templateVersion={this.state.version} onSwitchVersion={this.onSwitchVersion} />
        </MainContentWrapper>
        {this.props.modalState === ModalState.Publish && <PublishModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.Unpublish && <UnpublishModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.Share && <ShareModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.ShareSuccess && <ShareSuccessModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.Delete && <DeleteModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalState === ModalState.EditName && <EditNameModal />}

      </OuterWrapper>
    );
  }
}

function onActionButtonClick(props: Props, state: State, val: any) {
  const templateState = getTemplateInstance(props.template, state.version).state || PostedTemplate.StateEnum.Draft;
  switch (val.text) {
    case SHARE:
      props.openModal(ModalState.Share);
      break;
    case EDIT_IN_DESIGNER:
      const { history } = props;
      if (history) history.push('/designer/' + props.template.id + '/' + state.version);
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
    case MANAGE:
      props.openModal(ModalState.Version);
      break;
    default:
      break;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TemplateInfo));
