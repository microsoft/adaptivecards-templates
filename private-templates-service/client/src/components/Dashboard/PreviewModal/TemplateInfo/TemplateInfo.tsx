import React from "react";
import { ActionButton, IDropdownOption } from "office-ui-fabric-react";

import { Template, TemplateInstance } from "adaptive-templating-service-typescript-node";

import PublishModal from "../../../Common/PublishModal";
import Tags from "../../../Common/Tags";

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
  DropdownStyles
} from "./styled";
import { THEME } from "../../../../globalStyles";

const buttons = [
  {
    text: "Edit in designer",
    icon: { iconName: "SingleColumnEdit" }
  },
  {
    text: "Delete",
    icon: { iconName: "Delete" }
  },
  {
    text: "Share",
    icon: { iconName: "AddFriend" }
  },
  {
    text: "Publish",
    icon: { iconName: "PublishContent" }
  }
];

// TODO: Dynamically show info. Backend not ready
const cards = [
  {
    header: "Owner",
    iconName: "Contact",
    bodyText: "Henry Trent"
  },
  {
    header: "Usage",
    body: <UsageNumber>56</UsageNumber>,
    bodyText: "Requests"
  }
];

interface Props {
  template: Template;
  onClose: () => void;
  onSwitchVersion: (templateVersion: string) => void;
}

interface State {
  isPublishOpen: boolean;
  version: string;
}

class TemplateInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPublishOpen: false, version: "1.0" };
  }

  toggleModal = () => {
    this.setState({ isPublishOpen: !this.state.isPublishOpen });
  };

  versionList = (instances: TemplateInstance[] | undefined): IDropdownOption[] => {
    if (!instances) return [];
    let options: IDropdownOption[] = [];
    for (let instance of instances) {
      if (!instance.version) continue;
      options.push({ key: instance.version, text: `Version ${instance.version}` });
    }
    return options;
  };

  onVersionChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) return;
    let version = option.key.toString();
    this.setState({ version: version });
    this.props.onSwitchVersion(version);
  };

  render() {
    const { isLive, tags, createdAt, instances } = this.props.template;
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
              <StatusIndicator isPublished={isLive} />
              <Status>{isLive ? "Published" : "Draft"}</Status>
            </TitleWrapper>
            <TimeStamp>Created {createdAtParsed}</TimeStamp>
            <ActionButton iconProps={{ iconName: "ChromeClose" }} onClick={onClose}>
              Close
            </ActionButton>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map(val => (
              <ActionButton key={val.text} iconProps={val.icon} allowDisabledFocus onClick={val.text === "Publish" ? this.toggleModal : () => {}}>
                {val.text}
              </ActionButton>
            ))}
          </ActionsWrapper>
        </HeaderWrapper>
        <MainContentWrapper>
          <RowWrapper>
            {cards.map(val => (
              <Card key={val.header}>
                <CardHeader>{val.header}</CardHeader>
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
                <Tags tags={tags} allowAddTag={true} />
              </TagsWrapper>
            </CardBody>
          </Card>
        </MainContentWrapper>
        {this.state.isPublishOpen && (
          <PublishModal toggleModal={this.toggleModal} template={this.props.template} templateVersion={this.state.version} />
        )}
      </OuterWrapper>
    );
  }
}

export default TemplateInfo;
