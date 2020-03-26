import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../store/rootReducer";

import { getOwnerName, getOwnerProfilePicture } from "../../../../store/templateOwner/actions";
import { OwnerType } from "../../../../store/templateOwner/types";

import { InfoWrapper } from "./styled";
import OwnerAvatar from "../OwnerAvatar";

const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owners,
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
  oID: string;
  getOwnerName: (oID: string) => void;
  getOwnerProfilePicture: (oID: string) => void;
  owner?: OwnerType;
}

class OwnerInfo extends React.Component<Props> {
  constructor(props: Props) {

    super(props);
    this.props.getOwnerName(this.props.oID);
    this.props.getOwnerProfilePicture(this.props.oID);
  }
  render() {
    return (
      <InfoWrapper>
        <OwnerAvatar index={this.props.oID} /> {(this.props.owner && this.props.owner.displayNames) ? this.props.owner.displayNames[this.props.oID] : ""}
      </InfoWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerInfo);
