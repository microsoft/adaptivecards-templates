import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar";
import { Banner, Styledh1, StyledLogo, MobileBanner } from "./styled";
import Logo from "../../assets/adaptive-cards-100-logo.png";

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle
  };
};

interface NavBarProps {
  currentPageTitle: string;
}

class NavBar extends React.Component<NavBarProps, {}> {
  render() {
    return (
      <Banner>
        <MobileBanner>
          <StyledLogo src={Logo} />
          <Styledh1>{this.props.currentPageTitle}</Styledh1>
        </MobileBanner>
        <SearchBar></SearchBar>
      </Banner>
    );
  }
}

export default connect(mapStateToProps)(NavBar);
