import React, { Component } from "react";
import RecentlyViewedTable from "./RecentlyViewedTable";
import { Template } from "adaptive-templating-service-typescript-node";
import {
  RecentlyViewedContainer,
  RecentlyViewedHeader,
  RecentlyViewedHeaderItem
} from "./styled";
import * as STRINGS from '../../../assets/strings';

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
          <RecentlyViewedHeaderItem>{STRINGS.NAME}</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>{STRINGS.DATE_MODIFIED}</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>{STRINGS.STATUS}</RecentlyViewedHeaderItem>
          <RecentlyViewedHeaderItem>{STRINGS.AUTHOR}</RecentlyViewedHeaderItem>
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
