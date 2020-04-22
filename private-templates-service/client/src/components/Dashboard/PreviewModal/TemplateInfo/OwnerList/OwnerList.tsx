import React from "react";
import { connect } from "react-redux";
import { OwnerType } from "../../../../../store/templateOwner/types";
import { RootState } from "../../../../../store/rootReducer";
import { ERROR_LOADING_IMAGE } from "../../../../../assets/strings";

import { IFacepileProps, Facepile, OverflowButtonType, IFacepilePersona } from 'office-ui-fabric-react/lib/Facepile';

interface Props {
  owner?: OwnerType;
  oids: string[];
}

const mapStateToProps = (state: RootState) => {
  return {
    owner: state.templateOwner.owners,
  };
};
const getPersonaProps = (persona: IFacepilePersona) => {
  return {
    hidePersonaDetails: true
  }
};
const facepileProps: IFacepileProps = {
  personas: [],
  maxDisplayablePersonas: 3,
  getPersonaProps: getPersonaProps
};

class OwnerList extends React.Component<Props> {

  render() {
    let facepilePersonas: IFacepilePersona[] = [];
    for (let oid of this.props.oids) {
      if (this.props.owner && this.props.owner.displayNames && this.props.owner.displayNames[oid]) {
        if (this.props.owner.imageURLs![oid] && (this.props.owner.imageURLs![oid] !== "-1")) {
          facepilePersonas.push({ imageUrl: this.props.owner.imageURLs![oid] });
        } else {
          facepilePersonas.push({ personaName: this.props.owner.displayNames[oid] });
        }
      }
    }
    facepileProps.personas = facepilePersonas;
    if (this.props.oids.length > 3) {
      facepileProps.overflowButtonType = OverflowButtonType.more;
      facepileProps.overflowButtonProps = { disabled: true };
    }
    if (this.props.owner && this.props.owner.imageURLs) {
      return (<Facepile {...facepileProps} />)
    } else {
      return (<div>{ERROR_LOADING_IMAGE}</div>)
    }
  }
}

export default connect(mapStateToProps)(OwnerList);
