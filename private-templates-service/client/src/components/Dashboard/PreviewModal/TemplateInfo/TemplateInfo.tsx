import React from 'react';

import { ActionButton } from 'office-ui-fabric-react';

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

const cards = [
  {
    header: 'Folder',
    iconName: 'FabricFolder',
    bodyText: 'Contoso Weather'
  },
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
  template: any;
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
      isPublished,
      createdAt
    } = this.props.template;
    const {
      onClose
    } = this.props;

    return (
      <OuterWrapper>
        <HeaderWrapper>
          <TopRowWrapper>
            <TitleWrapper>
              <Title>Version 1.0.0</Title>
              <StatusIndicator isPublished={isPublished} />
              <Status>{isPublished ? 'Published' : 'Draft'}</Status>
            </TitleWrapper>
            <TimeStamp>
              Created {createdAt}
            </TimeStamp>
            <ActionButton iconProps={{ iconName: 'ChromeClose' }} onClick={onClose} >Close</ActionButton>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map((val) => (
              <ActionButton iconProps={val.icon} allowDisabledFocus onClick={val.text === 'Publish' ? this.toggleModal : () => { }} >
                {val.text}
              </ActionButton>
            ))}
          </ActionsWrapper>
        </HeaderWrapper>
        <MainContentWrapper>
          <RowWrapper>
            {cards.map((val) => (
              <Card>
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
        </MainContentWrapper>
        {this.state.isPublishOpen && <PublishModal toggleModal={this.toggleModal} template={this.props.template} />}
      </OuterWrapper>
    );
  }
}

export default TemplateInfo;
