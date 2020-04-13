import React, { Component } from "react";
import { Template } from "adaptive-templating-service-typescript-node";
import { TemplateListContainer, TemplateListHeader, TemplateListHeaderItem } from "./styled";
import TemplateListContent from "./TemplateListContent";

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
          {displayComponents.templateName && <TemplateListHeaderItem>Name</TemplateListHeaderItem>}
          {displayComponents.dateModified && <TemplateListHeaderItem>Date Modified</TemplateListHeaderItem>}
          {displayComponents.status && <TemplateListHeaderItem>Status</TemplateListHeaderItem>}
          {displayComponents.author && <TemplateListHeaderItem>Owner</TemplateListHeaderItem>}
        </TemplateListHeader>
        <TemplateListContent templates={templates} propsOnClick={onClick} displayComponents={displayComponents} />
      </TemplateListContainer>
    );
  }
}
export interface ListViewComponents {
  templateName: boolean;
  version: boolean;
  dateModified: boolean;
  status: boolean;
  author: boolean;
}

export default TemplateList;
