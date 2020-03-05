import React from 'react';

import { RootState } from '../../../../store/rootReducer';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../../store/page/actions';

import PublishModal from '../../../Common/PublishModal';
import UnpublishModal from '../../../Common/UnpublishModal';
import Tags from '../../../Common/Tags';
import ShareModal from '../../../Common/ShareModal';
import VersionCard from './VersionCard';

import { Template, TemplateInstance, PostedTemplate } from 'adaptive-templating-service-typescript-node';

import { ActionButton, IDropdownOption } from 'office-ui-fabric-react';

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
    text: 'Edit in designer',
    icon: { iconName: 'SingleColumnEdit' }
  },
  {
    text: 'Delete',
    icon: { iconName: 'Delete' }
  },
  {
    text: 'Share',
    icon: { iconName: 'AddFriend' }
  },
  {
    text: 'Publish',
    altText: 'Unpublish',
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

interface Props {
  template: Template;
  onClose: () => void;
  onSwitchVersion: (templateVersion: string) => void;
  modalOpen?: string;
  openModal: (modalName: string) => void;
  closeModal: () => void;
}

interface State {
  version: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    modalOpen: state.page.modalOpen
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    openModal: (modalName: string) => {
      dispatch(openModal(modalName));
    },
    closeModal: () => {
      dispatch(closeModal());
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
    const vers = getVersion(this.props.template);
    this.state = { version: vers };
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
    this.props.onSwitchVersion(version);
  }

  render() {
    const {
      isLive,
      tags,
      createdAt,
      instances,
    } = this.props.template;
    const { onClose } = this.props;

    let createdAtParsed = "";

    if (createdAt) {
      const createdAtDate = new Date(createdAt);
      createdAtParsed = createdAtDate.toLocaleString();
    }

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
                />
              </Title>
              <StatusIndicator state={isLive ? PostedTemplate.StateEnum.Live : PostedTemplate.StateEnum.Draft} />
              <Status>{isLive ? 'Published' : 'Draft'}</Status>
            </TitleWrapper>
            <TimeStamp>
              Created {createdAtParsed}
            </TimeStamp>
            <ActionButton iconProps={{ iconName: 'ChromeClose' }} onClick={onClose} >Close</ActionButton>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map((val) => (
              <ActionButton key={val.text} iconProps={val.icon} allowDisabledFocus
                onClick={() => { onActionButtonClick(this.props, this.state, val) }}>
                {val.text === 'Publish' && getTemplateState(this.props.template, this.state.version) === PostedTemplate.StateEnum.Live ? val.altText : val.text}
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
        {this.props.modalOpen === 'publish' && getTemplateState(this.props.template, this.state.version) === PostedTemplate.StateEnum.Draft && <PublishModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalOpen === 'unpublish' && getTemplateState(this.props.template, this.state.version) === PostedTemplate.StateEnum.Live && <UnpublishModal template={this.props.template} templateVersion={this.state.version} />}
        {this.props.modalOpen === 'share' && <ShareModal template={this.props.template} templateVersion={this.state.version} />}
      </OuterWrapper>
    );
  }
}

function onActionButtonClick(props: Props, state: State, val: any) {
  if (val.text === 'Share') {
    props.openModal(val.text.toLowerCase());
  }
  else if (val.text === 'Publish') {
    if (getTemplateState(props.template, state.version) === PostedTemplate.StateEnum.Draft) {
      props.openModal(val.text.toLowerCase());
    }
    else if (getTemplateState(props.template, state.version) === PostedTemplate.StateEnum.Live) {
      props.openModal(val.altText.toLowerCase());
    }
    else {
      return;
    }
  }
  else {
    return;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateInfo);
