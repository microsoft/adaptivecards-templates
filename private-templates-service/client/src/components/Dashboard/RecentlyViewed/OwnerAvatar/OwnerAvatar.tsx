import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { OwnerType } from "../../../../store/templateOwner/types";

import { ERROR_LOADING_IMAGE, ALT_TEXT } from "../../../../assets/strings";
import { ProfilePic, Container, InitialsPic, Initials } from "./styled";

interface Props {
  owner?: OwnerType;
  oID: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owners,
  };
};

class OwnerAvatar extends React.Component<Props> {

  render() {
    if (this.props.owner && this.props.owner.imageURLs && this.props.owner.imageURLs[this.props.oID]) {
      return (
        <Container>
          <ProfilePic src={this.props.owner.imageURLs[this.props.oID]} alt={ALT_TEXT}></ProfilePic>
        </Container>)
    }
    else if (this.props.owner && this.props.owner.displayNames && this.props.owner.displayNames[this.props.oID]) {
      return (
        <Container>
          <InitialsPic>
            <Initials>
              {this.props.owner.displayNames[this.props.oID][0]}
            </Initials>
          </InitialsPic>
        </Container>)
    }
    return (<div>{ERROR_LOADING_IMAGE}</div>)
  }
}

export default connect(mapStateToProps)(OwnerAvatar);