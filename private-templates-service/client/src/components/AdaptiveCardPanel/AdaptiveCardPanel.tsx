import * as React from "react";

import { RootState } from "../../store/rootReducer";
import { connect } from "react-redux";

import {
  Container,
  TemplateName,
  ACWrapper,
  TemplateFooterWrapper,
  TemplateStateWrapper,
  TemplateNameAndDateWrapper,
  TemplateUpdatedAt,
  Align
} from "./styled";
import {
  StatusIndicator,
  Status
} from "../Dashboard/PreviewModal/TemplateInfo/styled";

import AdaptiveCard from "../Common/AdaptiveCard";

import {
  Template,
  PostedTemplate,
} from "adaptive-templating-service-typescript-node";

import { getLatestVersion, getLatestTemplateInstanceState } from "../../utils/TemplateUtil";
import { getDateString } from "../../utils/versionUtils";
import KeyCode from "../../globalKeyCodes";
import * as STRINGS from "../../assets/strings"
import { getState } from "../../utils/stringUtils";
import { NA } from "../../assets/strings";

interface Props {
  onClick?: (templateID: string) => void;
  template: Template;
  version?: string;
  pageTitle?: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    pageTitle: state.page.currentPageTitle
  };
};

class AdaptiveCardPanel extends React.Component<Props> {
  onKeyDown = (event: React.KeyboardEvent) => {
    if (this.props.onClick && this.props.template.id && event.keyCode === KeyCode.ENTER) {
      this.props.onClick(this.props.template.id);
    }
  }

  onClick = () => {
    if (this.props.onClick && this.props.template.id) {
      this.props.onClick(this.props.template.id);
    }
  }

  isComponentNavigable = () => {
    if (this.props.pageTitle) {
      let pageTitle: string = this.props.pageTitle.toLowerCase();
      return pageTitle === STRINGS.DASHBOARD.toLowerCase() || pageTitle === STRINGS.ALL_CARDS_TITLE.toLowerCase();
    }
    return false;
  }

  render() {
    let template = this.props.template;
    let version = this.props.version ? this.props.version : getLatestVersion(this.props.template);
    let state = getLatestTemplateInstanceState(template);

    const isComponentNavigable = this.isComponentNavigable();
    const isStateDefined = Boolean(template.instances && template.instances[0] && template.instances[0].state);
    return (
      <Container tabIndex={isComponentNavigable ? 0 : -1}
        onKeyDown={isComponentNavigable ? this.onKeyDown : () => { }}
        onClick={isComponentNavigable ? this.onClick : () => { }}>
        <ACWrapper>
          <AdaptiveCard cardtemplate={template} templateVersion={version} hoverEffect />
        </ACWrapper>
        <TemplateFooterWrapper>
          <TemplateNameAndDateWrapper>

            <TemplateName>{template.name}</TemplateName>
            <TemplateUpdatedAt>
              {template.updatedAt ? getDateString(template.updatedAt) : `${NA}`}
            </TemplateUpdatedAt>
          </TemplateNameAndDateWrapper>
          <Align>
            <TemplateStateWrapper style={{ justifyContent: "center" }}>
              <StatusIndicator state={isStateDefined ? template!.instances![0].state : PostedTemplate.StateEnum.Draft}
                style={{ marginRight: "10px" }}
              />
              <Status>{getState(state)}</Status>
            </TemplateStateWrapper>
          </Align>
        </TemplateFooterWrapper>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(AdaptiveCardPanel);
