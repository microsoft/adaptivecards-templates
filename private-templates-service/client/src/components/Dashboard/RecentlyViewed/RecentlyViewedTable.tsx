import React from "react";

import {
  Template,
  PostedTemplate
} from "adaptive-templating-service-typescript-node";

import {
  RecentlyViewedBodyRow,
  RecentlyViewedItem,
  RecentlyViewedBody,
  RecentlyViewedStatusIndicator
} from "./styled";

import { getDateString } from "../../../utils/versionUtils";
import { Status } from "../PreviewModal/TemplateInfo/styled";
import { TemplateStateWrapper } from "../../AdaptiveCardPanel/styled";
import OwnerInfo from "./OwnerInfo";
import KeyCode from "../../../globalKeyCodes";

interface Props {
  templates: Template[];
  propsOnClick?: (id: string) => any;
}

class RecentlyViewedTable extends React.Component<Props> {
  render() {
    const { templates, propsOnClick } = this.props;
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
      }
      if (!template || !template.instances || !template.instances[0] || !template.instances[0].lastEditedUser) {
        return <div>Error loading templates</div>
      }

      return (
        <RecentlyViewedBodyRow key={template.instances[0]!.lastEditedUser!} onClick={onClick} onKeyDown={onKeyDown} tabIndex={0}>
          <RecentlyViewedItem>{template.name}</RecentlyViewedItem>
          <RecentlyViewedItem>
            {template.updatedAt ? getDateString(template.updatedAt) : "N/A"}
          </RecentlyViewedItem>
          <RecentlyViewedItem>
            <TemplateStateWrapper>
              <RecentlyViewedStatusIndicator state={template.instances[0].state}/>
              <Status>{template.instances[0].state && template.instances[0].state.toString().charAt(0).toUpperCase() + template.instances[0].state.toString().slice(1)}</Status>
            </TemplateStateWrapper>
          </RecentlyViewedItem>
          < RecentlyViewedItem > <OwnerInfo oID={template.instances[0]!.lastEditedUser!} ></OwnerInfo></RecentlyViewedItem >
        </RecentlyViewedBodyRow >
      );
    });
    return <RecentlyViewedBody>{rows}</RecentlyViewedBody>;
  }
}

export default RecentlyViewedTable;
