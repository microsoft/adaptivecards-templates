// React
import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
// Components
import TemplatesPage from "../Common/TemplatesPage";
// Redux Store
import { getAllTags } from "../../store/tags/actions";
import { getAllTemplates } from "../../store/templates/actions";
import { SortType } from "../../store/sort/types";
import { FilterEnum } from "../../store/filter/types";
// Strings
import { ALL_CARDS, ALL_CARDS_TITLE } from "../../assets/strings";
// Utils
import requireAuthentication from "../../utils/requireAuthentication";
import { allTemplatesURL } from "../SideBar/SideBar";
const mapDispatchToProps = (dispatch: any) => {
  return {
    getTemplates: (tags?: string[], ifOwned?: boolean, name?: string, sortBy?: SortType, filterState?: FilterEnum) => {
      dispatch(getAllTemplates(tags, ifOwned, name, sortBy, filterState));
    },
    getTags: () => {
      dispatch(getAllTags());
    },
  };
};

interface Props extends RouteComponentProps {
  getTemplates: (tags?: string[], ifOwned?: boolean, name?: string, sortBy?: SortType, filterState?: FilterEnum) => void;
  getTags: () => void;
}
export class AllCards extends Component<Props> {
  render() {
    return (
      <TemplatesPage
        getTags={this.props.getTags}
        getTemplates={this.props.getTemplates}
        pageTitle={ALL_CARDS_TITLE}
        pageID={ALL_CARDS}
        basePath={allTemplatesURL}
      />
    );
  }
}
export default connect(
  null,
  mapDispatchToProps
)(requireAuthentication(withRouter(AllCards)));
