import React from 'react';
import { ActionButton, IconButton } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import { Template } from 'adaptive-templating-service-typescript-node';

import PublishModal from '../../../Common/PublishModal';

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
  Tag,
  TagCloseIcon,
  TagText,
  AddTagWrapper,
  AddTagInput,
  TagAddIcon,
  TagSubmitIcon,
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
}

interface State {
  isPublishOpen: boolean;
  isAdding: boolean;
  newTagName: string;
}

class TemplateInfo extends React.Component<Props, State> {
  addTagInput = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      isPublishOpen: false,
      isAdding: false,
      newTagName: '',
    }
  }

  toggleModal = () => {
    this.setState({ isPublishOpen: !this.state.isPublishOpen });
  }

  tagRemove = (tag: string) => {
    console.log(tag);
  }

  openNewTag = () => {
    this.setState({ isAdding: true }, () => {
      if (this.addTagInput && this.addTagInput.current) {
        this.addTagInput.current.focus();
      }
    });
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event && event.currentTarget) {
      this.setState({ newTagName: event.currentTarget.value });
    }
  }

  submitNewTag = () => {
    if (this.addTagInput && this.addTagInput.current) {
      const tag = this.addTagInput.current.value;
      console.log("new tag submitted: ", tag);
    }
  }

  closeAddTag = () => {
    this.setState({ isAdding: false });
  }

  render() {
    const {
      isLive,
      createdAt,
      tags,
    } = this.props.template;
    const { onClose } = this.props;
    const {
      isAdding
    } = this.state;

    return (
      <OuterWrapper>
        <HeaderWrapper>
          <TopRowWrapper>
            <TitleWrapper>
              <Title>Version 1.0.0</Title>
              <StatusIndicator isPublished={isLive} />
              <Status>{isLive ? 'Published' : 'Draft'}</Status>
            </TitleWrapper>
            <TimeStamp>
              Created {createdAt}
            </TimeStamp>
            <ActionButton iconProps={{ iconName: 'ChromeClose' }} onClick={onClose} >Close</ActionButton>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map((val) => (
              <ActionButton key={val.text} iconProps={val.icon} allowDisabledFocus onClick={val.text === 'Publish' ? this.toggleModal : () => { }} >
                {val.text}
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
                {tags && tags.map((tag: string) => (
                  <Tag key={tag}>
                    <TagText>{tag}</TagText>
                    <TagCloseIcon key={tag} iconName="ChromeClose" onClick={() => this.tagRemove(tag)} />
                  </Tag>
                ))}
                <AddTagWrapper onSubmit={this.submitNewTag} open={isAdding}>
                  <AddTagInput ref={this.addTagInput} open={isAdding} value={this.state.newTagName} onChange={this.handleChange} />
                  <TagAddIcon iconName="Add" onClick={this.openNewTag} open={isAdding} />
                  <TagSubmitIcon iconName="CheckMark" onClick={this.submitNewTag} open={isAdding} />
                </AddTagWrapper>
              </TagsWrapper>
            </CardBody>
          </Card>
        </MainContentWrapper>
        {this.state.isPublishOpen && <PublishModal toggleModal={this.toggleModal} template={this.props.template} />}
      </OuterWrapper>
    );
  }
}

export default TemplateInfo;
