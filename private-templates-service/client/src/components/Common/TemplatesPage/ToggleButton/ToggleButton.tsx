// React
import React, { Component } from "react";
import { connect } from "react-redux";
// Store
import { ViewType, ViewToggleState } from "../../../../store/viewToggle/types";
import { RootState } from "../../../../store/rootReducer";
// Fabric ui
import { IconButton, IIconProps, IButtonStyles } from "office-ui-fabric-react";

const toggleButtonStyles: IButtonStyles = {
  root: {
    selectors: {
      "&:focus": {
        outline: "none"
      }
    }
  }
};

const mapStateToProps = (state: RootState) => {
  return {
    toggleState: state.allCardsViewToggle
  };
};

interface ToggleButtonProps {
  onClick: (arg: ViewType) => void;
  viewType: ViewType;
  iconProps: IIconProps;
  title: string;
  toggleState: ViewToggleState;
}
class ToggleButton extends Component<ToggleButtonProps> {
  onClick = () => {
    this.props.onClick(this.props.viewType);
  };
  render() {
    return (
      <React.Fragment>
        <IconButton iconProps={this.props.iconProps} onClick={this.onClick} title={this.props.title} checked={this.props.toggleState.viewType === this.props.viewType} styles={toggleButtonStyles} />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(ToggleButton);
