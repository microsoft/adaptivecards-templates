import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { UserType } from "../../store/auth/types";
import { OwnerType } from "../../store/templateOwner/types";

import { Facepile, IFacepilePersona, IFacepileProps, IFacepileStyleProps } from 'office-ui-fabric-react/lib/Facepile';
import { PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';

import { AvatarIcon, DefaultAvatarIcon, OwnerAvatar } from "./styled";

interface Props {
  user?: UserType;
  owner?: OwnerType;
  setOwner?: boolean;
  iconSize?: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.user,
    owner: state.templateOwner.owner
  };
};

class UserAvatar extends React.Component<Props> {
  // If a user avatar is available, return an img tag with the pic

  render() {
    if (this.props.setOwner){
      if (this.props.owner && this.props.owner.imageURL){
        let facepileProps: IFacepileProps = {
          personaSize: PersonaSize.size24,
          personas: new Array({imageUrl: this.props.owner.imageURL, }),
        };
        return (<Facepile {...facepileProps} />)
      }
      else if (this.props.owner && this.props.owner.displayName && this.props.owner.displayName[0]) {
        let facepileProps: IFacepileProps = {
          personaSize: PersonaSize.size24,
          personas: new Array({imageInitials: this.props.owner.displayName[0], }),
        };
        return (<Facepile {...facepileProps} />)
      }
    }
    if (this.props.user && this.props.user.imageURL) {
      return (
        <AvatarIcon
          src={this.props.user.imageURL}
          alt="user"
          className="rounded-circle align-self-center"
        ></AvatarIcon>
      );
    }
    //No avatar available, return a default icon
    return (
      <DefaultAvatarIcon iconName="contact" size={this.props.iconSize} ></DefaultAvatarIcon>
    );
  }
}

export default connect(mapStateToProps)(UserAvatar);
