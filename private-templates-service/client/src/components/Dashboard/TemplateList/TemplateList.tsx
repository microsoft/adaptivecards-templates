import React, { Component } from "react";
import { Template } from "adaptive-templating-service-typescript-node";
import { TemplateListContainer, TemplateListHeader, TemplateListHeaderItem } from "./styled";
import TemplateListContent from "./TemplateListContent";
import { TEMPLATE_LIST_NAME, TEMPLATE_LIST_STATUS, TEMPLATE_LIST_OWNER, TEMPLATE_LIST_DATE } from "../../../assets/strings";

export interface ListViewComponents {
  templateName: boolean;
  version: boolean;
  dateModified: boolean;
  status: boolean;
  author: boolean;
}

interface Props {
  templates: Template[];
  onClick?: (id: string) => any;
  displayComponents: ListViewComponents;
}

export class TemplateList extends Component<Props> {
  render() {
    const { templates, onClick, displayComponents } = this.props;
    return (
      <TemplateListContainer>
        <TemplateListHeader>
          {displayComponents.templateName && <TemplateListHeaderItem>{TEMPLATE_LIST_NAME}</TemplateListHeaderItem>}
          {displayComponents.dateModified && <TemplateListHeaderItem>{TEMPLATE_LIST_DATE}</TemplateListHeaderItem>}
          {displayComponents.status && <TemplateListHeaderItem>{TEMPLATE_LIST_STATUS}</TemplateListHeaderItem>}
          {displayComponents.author && <TemplateListHeaderItem>{TEMPLATE_LIST_OWNER}</TemplateListHeaderItem>}
        </TemplateListHeader>
        <TemplateListContent templates={templates} propsOnClick={onClick} displayComponents={displayComponents} />
      </TemplateListContainer>
    );
  }
}

export default TemplateList;
