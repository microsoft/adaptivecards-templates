import React, { Component } from "react";
import { Template, PostedTemplate } from "adaptive-templating-service-typescript-node";
import {
  RecentlyViewedContainer,
  RecentlyViewedBodyRow,
  RecentlyViewedHeader,
  RecentlyViewedItem,
  RecentlyViewedBody,
  RecentlyViewedHeaderItem
} from "./styled";
import { getDateString } from "../../../utils/versionUtils";
import { StatusIndicator, Status, Title, TimeStamp } from "../PreviewModal/TemplateInfo/styled";
import { TemplateStateWrapper } from "../../AdaptiveCardPanel/styled";

interface Props {
  recentlyViewed: Template[];
  onClick?: (templateID: string) => void;
}

export class RecentlyViewed extends Component<Props> {
  private constructRecentlyViewedRows(templates: Template[], propsOnClick: (id: string) => any): JSX.Element[] {
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
          <RecentlyViewedItem>{template.updatedAt ? getDateString(template.updatedAt) : "N/A"}</RecentlyViewedItem>
          <RecentlyViewedItem>
            <TemplateStateWrapper style={{ justifyContent: "flex-start" }}>
              <StatusIndicator
                state={template.isLive ? PostedTemplate.StateEnum.Live : PostedTemplate.StateEnum.Draft}
                style={{ marginRight: "10px", marginLeft: "0px" }}
              />
              <Status>{template.isLive ? "Published" : "Draft"}</Status>
            </TemplateStateWrapper>
          </RecentlyViewedItem>
          <RecentlyViewedItem>User Name</RecentlyViewedItem>
        </RecentlyViewedBodyRow>
      );
    });
    return rows;
  }

  constructor(props: Props) {
    super(props);
  }

  render() {
    const rows = this.constructRecentlyViewedRows(this.props.recentlyViewed, this.props.onClick!);
    return (
      <RecentlyViewedContainer>
        <RecentlyViewedHeader>
          <RecentlyViewedHeaderItem>Name</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>Date Modified</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>Status</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>Owner</RecentlyViewedHeaderItem>
        </RecentlyViewedHeader>
        <RecentlyViewedBody>{rows}</RecentlyViewedBody>
      </RecentlyViewedContainer>
    );
  }
}

export default RecentlyViewed;
