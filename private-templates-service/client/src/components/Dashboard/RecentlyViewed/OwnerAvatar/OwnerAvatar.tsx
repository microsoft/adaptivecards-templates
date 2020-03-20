import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { OwnerType } from "../../../../store/templateOwner/types";

import { Facepile, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile';
import { PersonaSize } from 'office-ui-fabric-react/lib/Persona';

interface Props {
  owner?: OwnerType;
}

const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owner
  };
};

class OwnerAvatar extends React.Component<Props> {
  // If a user avatar is available, return an img tag with the pic

  render() {
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
      return (<div>Error loading image</div>)
  }
}

export default connect(mapStateToProps)(OwnerAvatar);
