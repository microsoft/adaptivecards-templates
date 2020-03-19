import React from "react";

// Redux
import { connect } from "react-redux";
import { getOwnerName, getOwnerProfilePicture } from "../../../store/templateOwner/actions";
import { OwnerType } from "../../../store/templateOwner/types";
import { RootState } from "../../../store/rootReducer";

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


// how to find type of owner??
const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owner,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getOwnerName: (oID: string) => {
      dispatch(getOwnerName(oID));
    },
    getOwnerProfilePicture: (oID: string) => {
      dispatch(getOwnerProfilePicture(oID));
    }
  }
}

interface Props {
  templates: Template[];
  propsOnClick?: (id: string) => any;
  getOwnerName: (oID: string) => void;
  getOwnerProfilePicture: (oID: string) => void;
  owner?: OwnerType;
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
      // if (!template || !template.instances || template.instances[0] || template.instances[0].lastEditedUser) {
      //   return <div>Error loading templates</div>
      // }
      this.getOwnerInfo('2e3f0fbf-9a55-4232-b041-06ae601a16a8');
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
          <RecentlyViewedItem>Pic!! {(this.props.owner && this.props.owner.displayName) ? this.props.owner?.displayName : ""}</RecentlyViewedItem>
        </RecentlyViewedBodyRow>
      );
    });
    return <RecentlyViewedBody>{rows}</RecentlyViewedBody>;
  }

  getOwnerInfo = async (oID: string) => {
    this.props.getOwnerName(oID);
    this.props.getOwnerProfilePicture(oID);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyViewedTable);
