import React, { Component } from "react";
import { Template } from "adaptive-templating-service-typescript-node";
import {
  RecentlyViewedContainer,
  RecentlyViewedHeader,
  RecentlyViewedHeaderItem
} from "./styled";
import RecentlyViewedTable from "./RecentlyViewedTable";

interface Props {
  recentlyViewed: Template[];
  onClick?: (id: string) => any;
}

export class RecentlyViewed extends Component<Props> {
  render() {
    const { recentlyViewed, onClick } = this.props;
    return (
      <RecentlyViewedContainer>
        <RecentlyViewedHeader>
          <RecentlyViewedHeaderItem>Name</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>Date Modified</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>Status</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>Owner</RecentlyViewedHeaderItem>
        </RecentlyViewedHeader>
        <RecentlyViewedTable
          templates={recentlyViewed}
          propsOnClick={onClick}
        ></RecentlyViewedTable>
      </RecentlyViewedContainer>
    );
  }
}

export default RecentlyViewed;
