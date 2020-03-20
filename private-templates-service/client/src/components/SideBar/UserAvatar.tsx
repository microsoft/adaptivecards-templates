import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AvatarIcon, DefaultAvatarIcon } from "./styled";

interface Props {
  user?: UserType;
  iconSize?: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.user
  };
};

class UserAvatar extends React.Component<Props> {
  // If a user avatar is available, return an img tag with the pic
  render() {
    if (this.props.user && this.props.user.imageURL) {
      return (
        <AvatarIcon
          src={this.props.user.imageURL}
          alt="user"
          className="rounded-circle align-self-center"
        ></AvatarIcon>
      );
    }
    // No avatar available, return a default icon
    return (
      <DefaultAvatarIcon iconName="contact" size={this.props.iconSize} ></DefaultAvatarIcon>
    );
  }
}

export default connect(mapStateToProps)(UserAvatar);