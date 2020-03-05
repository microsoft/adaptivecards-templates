import React from "react";
import { ActionButton, IDropdownOption } from "office-ui-fabric-react";

import { Template, TemplateInstance, PostedTemplate } from "adaptive-templating-service-typescript-node";

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
import VersionCard from "./VersionCard";
import UnpublishModal from "../../../Common/UnpublishModal";

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
    altText: "Unpublish",
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
  onSwitchVersion: (templateVersion: string) => void;
}

interface State {
  isPublishOpen: boolean;
  version: string;
}

function getVersion(template: Template): string {
  if (template.instances && template.instances[0] && template.instances[0].version) {
    return template.instances[0].version;
  }
  return "1.0";
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
    this.state = { isPublishOpen: false, version: vers };
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
              <Status>{isLive ? "Published" : "Draft"}</Status>
            </TitleWrapper>
            <TimeStamp>Created {createdAtParsed}</TimeStamp>
          </TopRowWrapper>
          <ActionsWrapper>
            {buttons.map(val => (
              <ActionButton key={val.text} iconProps={val.icon} allowDisabledFocus onClick={val.text === "Publish" ? this.toggleModal : () => {}}>
                {val.text === "Publish" && getTemplateState(this.props.template, this.state.version) === PostedTemplate.StateEnum.Live
                  ? val.altText
                  : val.text}
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
                <Tags tags={tags} allowAddTag={true} allowEdit={true} />
              </TagsWrapper>
            </CardBody>
          </Card>
          <RowWrapper>
            <VersionCard template={this.props.template} templateVersion={this.state.version} />
          </RowWrapper>
        </MainContentWrapper>
        {this.state.isPublishOpen && getTemplateState(this.props.template, this.state.version) === PostedTemplate.StateEnum.Draft && (
          <PublishModal toggleModal={this.toggleModal} template={this.props.template} templateVersion={this.state.version} />
        )}
        {this.state.isPublishOpen && getTemplateState(this.props.template, this.state.version) === PostedTemplate.StateEnum.Live && (
          <UnpublishModal toggleModal={this.toggleModal} template={this.props.template} templateVersion={this.state.version} />
        )}
      </OuterWrapper>
    );
  }
}

export default TemplateInfo;
