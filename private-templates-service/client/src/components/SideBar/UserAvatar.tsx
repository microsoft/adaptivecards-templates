import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AvatarIcon, DefaultAvatarIcon } from "./styled";

interface UserAvatarProps {
  user?: UserType;
  iconSize?: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.user
  };
};

export function UserAvatar(props: UserAvatarProps): ReactElement {
  // If a user avatar is available, return an img tag with the pic
  if (props.user && props.user.avatar) {
    return (
      <AvatarIcon
        src={props.user.avatar}
        alt="user"
        className="rounded-circle align-self-center"
      ></AvatarIcon>
    );
  }
  // No avatar available, return a default icon
  return (
    <DefaultAvatarIcon iconName="contact" size={props.iconSize} ></DefaultAvatarIcon>
  );
}

export default connect(mapStateToProps)(UserAvatar);
