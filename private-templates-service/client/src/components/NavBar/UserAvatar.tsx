import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { AvatarIcon, DefaultAvatarIcon } from "./styled";

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user
  };
};

export function UserAvatar(props: { user: UserType | {} }): ReactElement {
  // If a user avatar is available, return an img tag with the pic
  if ("avatar" in props.user) {
    return (
      <AvatarIcon
        src={props.user.avatar}
        alt="user"
        className="rounded-circle align-self-center mr-2"
      ></AvatarIcon>
    );
  }
  // No avatar available, return a default icon
  return (
    <DefaultAvatarIcon className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"></DefaultAvatarIcon>
  );
}

const VisibleUserAvatar = connect(mapStateToProps)(UserAvatar);

export default VisibleUserAvatar;
