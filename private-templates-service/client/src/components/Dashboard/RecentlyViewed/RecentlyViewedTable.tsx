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

interface Props {
  templates: Template[];
  propsOnClick?: (id: string) => any;
}

class RecentlyViewedTable extends React.Component<Props> {
  render() {
    const { templates, propsOnClick } = this.props;
    let rows: JSX.Element[] = new Array();
    rows = templates.map(template => {
      let onClick = () => {
        if (propsOnClick && template.id) {
          propsOnClick(template.id);
        }
      };
      return (
        <RecentlyViewedBodyRow onClick={onClick}>
          <RecentlyViewedItem>{template.name}</RecentlyViewedItem>
          <RecentlyViewedItem>
            {template.updatedAt ? getDateString(template.updatedAt) : "N/A"}
          </RecentlyViewedItem>
          <RecentlyViewedItem>
            <TemplateStateWrapper>
              <RecentlyViewedStatusIndicator
                state={
                  template.isLive
                    ? PostedTemplate.StateEnum.Live
                    : PostedTemplate.StateEnum.Draft
                }
              />
              <Status>{template.isLive ? "Published" : "Draft"}</Status>
            </TemplateStateWrapper>
          </RecentlyViewedItem>
          <RecentlyViewedItem>User Name</RecentlyViewedItem>
        </RecentlyViewedBodyRow>
      );
    });
    return <RecentlyViewedBody>{rows}</RecentlyViewedBody>;
  }
}

export default RecentlyViewedTable;
