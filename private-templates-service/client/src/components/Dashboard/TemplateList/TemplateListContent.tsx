import React from "react";

import { Template } from "adaptive-templating-service-typescript-node";

import { TemplateListBodyRow, TemplateListItem, TemplateListBody, TemplateListStatusIndicator, StatusWrapper } from "./styled";

import { ListViewComponents } from "./TemplateList";
import { getDateString } from "../../../utils/versionUtils";
import { capitalizeString } from "../../../utils/stringUtils";
import { Status } from "../PreviewModal/TemplateInfo/styled";
import { TemplateStateWrapper } from "../../AdaptiveCardPanel/styled";
import OwnerInfo from "./OwnerInfo";
import KeyCode from "../../../globalKeyCodes";

interface Props {
  templates: Template[];
  propsOnClick?: (id: string) => any;
  displayComponents: ListViewComponents;
}

class TemplateListContent extends React.Component<Props> {
  render() {
    const { templates, propsOnClick, displayComponents } = this.props;
    let rows: JSX.Element[] = [];
    rows = templates.map((template: Template) => {
      let onClick = () => {
        if (propsOnClick && template.id) {
          propsOnClick(template.id);
        }
      };
      let onKeyDown = (keyStroke: any) => {
        if (propsOnClick && template.id && keyStroke.keyCode === KeyCode.ENTER) {
          propsOnClick(template.id);
        }
      };
      if (!template || !template.instances || !template.instances[0] || !template.instances[0].lastEditedUser) {
        return <div>Error loading templates</div>;
      }

      return (
        <TemplateListBodyRow key={template.instances[0]!.lastEditedUser!} onClick={onClick} onKeyDown={onKeyDown} tabIndex={0}>
          {displayComponents.templateName && <TemplateListItem>{template.name}</TemplateListItem>}
          {displayComponents.dateModified && <TemplateListItem>{template.updatedAt ? getDateString(template.updatedAt) : "N/A"}</TemplateListItem>}
          {displayComponents.status && (
            <TemplateListItem>
              <TemplateStateWrapper>
                <TemplateListStatusIndicator state={template.instances[0].state} />
                <StatusWrapper>
                  <Status>{template.instances[0].state && capitalizeString(template.instances[0].state.toString())}</Status>
                </StatusWrapper>
              </TemplateStateWrapper>
            </TemplateListItem>
          )}
          {displayComponents.author && (
            <TemplateListItem>
              <OwnerInfo oID={template.instances[0]!.lastEditedUser!} />
            </TemplateListItem>
          )}
        </TemplateListBodyRow>
      );
    });
    return <TemplateListBody>{rows}</TemplateListBody>;
  }
}
export default TemplateListContent;
