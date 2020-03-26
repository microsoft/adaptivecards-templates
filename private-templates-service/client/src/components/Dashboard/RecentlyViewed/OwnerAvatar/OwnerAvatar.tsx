import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { OwnerType } from "../../../../store/templateOwner/types";

import { Facepile, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile';
import { PersonaSize } from 'office-ui-fabric-react/lib/Persona';

interface Props {
  owner?: OwnerType;
  index: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owners
  };
};

class OwnerAvatar extends React.Component<Props> {

  render() {
    if (this.props.owner && this.props.owner.imageURLs && this.props.owner.imageURLs[this.props.index]) {
      let facepileProps: IFacepileProps = {
        personaSize: PersonaSize.size24,
        personas: new Array({ imageUrl: this.props.owner.imageURLs[this.props.index], }),
      };
      return (<Facepile {...facepileProps} ariaLabel={"Facepile displaying profile pictures"} />)
    }
    else if (this.props.owner && this.props.owner.displayNames && this.props.owner.displayNames[this.props.index] && this.props.owner.displayNames[this.props.index][0]) {
      let facepileProps: IFacepileProps = {
        personaSize: PersonaSize.size24,
        personas: new Array({ imageInitials: this.props.owner.displayNames[this.props.index][0], }),
      };
      return (<Facepile {...facepileProps} ariaLabel={"Facepile displaying profile pictures"} />)
    }
    return (<div>Error loading image</div>)
  }
}

export default connect(mapStateToProps)(OwnerAvatar);