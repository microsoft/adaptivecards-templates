import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { OwnerType } from "../../../../store/templateOwner/types";

import { ERROR_LOADING_IMAGE, ALT_TEXT } from "../../../../assets/strings";
import { Container } from "./styled";
import { IPersonaSharedProps, Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';


interface Props {
  owner?: OwnerType;
  oID: string;
  sizeInPx?: number;
}

const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owners,
  };
};

class OwnerAvatar extends React.Component<Props> {

  render() {
    if (this.props.owner && (this.props.owner.imageURLs || this.props.owner.displayNames)) {
      let persona: IPersonaSharedProps = {};
      if (this.props.owner.imageURLs![this.props.oID] && (this.props.owner.imageURLs![this.props.oID] !== "-1")) {
        persona.imageUrl = this.props.owner.imageURLs![this.props.oID];
        persona.imageAlt = ALT_TEXT;
      }
      if (this.props.owner.displayNames![this.props.oID]) persona.text = this.props.owner.displayNames![this.props.oID];
      return (<Container><Persona {...persona} size={this.props.sizeInPx || PersonaSize.size28} hidePersonaDetails={true} /></Container>);
    }
    return (<div>{ERROR_LOADING_IMAGE}</div>)
  }
}

export default connect(mapStateToProps)(OwnerAvatar);
