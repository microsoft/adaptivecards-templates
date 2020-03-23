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
    getOwnerName: (oID: string, index: number) => {
      dispatch(getOwnerName(oID, index));
    },
    getOwnerProfilePicture: (oID: string, index: number) => {
      dispatch(getOwnerProfilePicture(oID, index));
    }
  }
}

interface Props {
  oID: string;
  index: number;
  getOwnerName: (oID: string, index: number) => void;
  getOwnerProfilePicture: (oID: string, index: number) => void;
  owner?: OwnerType;
}

class OwnerInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.getOwnerName(this.props.oID, this.props.index);
    this.props.getOwnerProfilePicture(this.props.oID, this.props.index);
  }
  render() {
    return (
      <InfoWrapper>
        <OwnerAvatar index={this.props.index} /> {(this.props.owner && this.props.owner.displayNames) ? this.props.owner.displayNames[this.props.index] : ""}
      </InfoWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerInfo);
