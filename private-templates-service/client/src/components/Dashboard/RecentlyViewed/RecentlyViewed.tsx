import React, { Component } from "react";
import { TemplateList, Template, PostedTemplate } from "adaptive-templating-service-typescript-node";
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
  recentlyViewed: TemplateList;
}

export class RecentlyViewed extends Component<Props> {
  private constructRecentlyViewedRows(templates: TemplateList): JSX.Element[] {
    let rows: JSX.Element[] = new Array();
    if (templates.templates) {
      rows = templates.templates.map(template => {
        return (
          <RecentlyViewedBodyRow>
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
    }
    return rows;
  }

  constructor(props: Props) {
    super(props);
  }

  render() {
    const rows = this.constructRecentlyViewedRows(this.props.recentlyViewed);
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
