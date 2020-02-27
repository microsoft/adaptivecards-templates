import React from 'react';
import { ActionButton } from 'office-ui-fabric-react';

import { Template } from 'adaptive-templating-service-typescript-node';

import PublishModal from '../../../Common/PublishModal';
import Tags from '../../../Common/Tags';

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
}

class TemplateInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPublishOpen: false }
  }

  toggleModal = () => {
    this.setState({ isPublishOpen: !this.state.isPublishOpen });
  }

  render() {
    const {
      isLive,
      createdAt,
      tags,
    } = this.props.template;
    const { onClose } = this.props;

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
                <Tags tags={["tag1", "tag2", "tag3", "weather", "reaaaaaaaaaaaally long tag!", "tag with emojis 🙃🙃🙃"]} allowAddTag={true} />
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
