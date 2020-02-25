import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar";
import { Banner, Styledh1, StyledLogo, MobileBanner } from './styled';
import Logo from '../../assets/adaptive-cards-100-logo.png'

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle,
    currentPage: state.page.currentPage,
    templateName: state.currentTemplate.templateName
  }
}

interface NavBarProps {
  currentPageTitle: string;
  currentPage: string;
  templateName?: string;
}

class NavBar extends React.Component<NavBarProps, {}> {
  render() {
    switch (this.props.currentPage.toLowerCase()) {
      case "dashboard":
        return (
          <Banner>
            <MobileBanner>
              <StyledLogo src={Logo} />
              <Styledh1>{this.props.currentPageTitle}</Styledh1>
            </MobileBanner>
            <SearchBar />
          </Banner>
        );
      case "designer":
        return (
          <Banner>
            <MobileBanner>
              <StyledLogo src={Logo} />
              <Styledh1>{this.props.templateName}</Styledh1>
            </MobileBanner>
          </Banner>
        );
    }
    return (
      <Banner>
        <MobileBanner>
          <StyledLogo src={Logo} />
          <Styledh1>{this.props.currentPageTitle}</Styledh1>
        </MobileBanner>
        <SearchBar />
      </Banner>
    )
  }
}

export default connect(mapStateToProps)(NavBar);
