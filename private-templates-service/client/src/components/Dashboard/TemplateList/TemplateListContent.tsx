import React from "react";

import { Template } from "adaptive-templating-service-typescript-node";

import { ListViewComponents } from "./TemplateList";
import { getDateString } from "../../../utils/versionUtils";
import { capitalizeString, getState } from "../../../utils/stringUtils";
import { Status } from "../PreviewModal/TemplateInfo/styled";
import { TemplateStateWrapper } from "../../AdaptiveCardPanel/styled";
import OwnerInfo from "./OwnerInfo";
import KeyCode from "../../../globalKeyCodes";

import {
  TemplateListBodyRow,
  TemplateListItem,
  TemplateListBody,
  TemplateListStatusIndicator,
  StatusWrapper,
  PlaceholderWrapper,
} from "./styled";

import {
  NO_CARDS_PLACEHOLDER,
  TEMPLATE_LIST_ERROR
} from '../../../assets/strings';

interface Props {
  templates: Template[];
  propsOnClick?: (id: string) => any;
  displayComponents: ListViewComponents;
}

class TemplateListContent extends React.Component<Props> {
  render() {
    const { templates, propsOnClick, displayComponents } = this.props;
    let rows: JSX.Element[] = [];

    if (templates.length === 0) {
      return (
        <PlaceholderWrapper>
          {NO_CARDS_PLACEHOLDER}
        </PlaceholderWrapper>
      )
    }

    rows = templates.map((template: Template, index: number) => {
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
        return <div>{TEMPLATE_LIST_ERROR}</div>;
      }


      let stateEnum = template.instances[0].state && capitalizeString(template.instances[0].state.toString());
      let stateStr = getState(stateEnum);
      return (
        <TemplateListBodyRow key={index} onClick={onClick} onKeyDown={onKeyDown} tabIndex={0}>
          {displayComponents.templateName && <TemplateListItem>{template.name}</TemplateListItem>}
          {displayComponents.dateModified && <TemplateListItem>{template.updatedAt ? getDateString(template.updatedAt) : "N/A"}</TemplateListItem>}
          {displayComponents.status && (
            <TemplateListItem>
              <TemplateStateWrapper>
                <TemplateListStatusIndicator state={template.instances[0].state} />
                <StatusWrapper>
                  <Status>{stateStr}</Status>
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
