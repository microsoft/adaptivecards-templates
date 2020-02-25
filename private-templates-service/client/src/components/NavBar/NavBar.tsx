import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar";
import { Banner, Styledh1, StyledLogo, MobileBanner, StyledButton } from './styled';
import Logo from '../../assets/adaptive-cards-100-logo.png'
import { DefaultSerializer } from "v8";
import { ActionButton } from "office-ui-fabric-react";
import { useHistory } from "react-router-dom";

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


const NavBar = (props: NavBarProps) => {

  let history = useHistory();

  switch (props.currentPage.toLowerCase()) {
    case "dashboard":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{props.currentPageTitle}</Styledh1>
          </MobileBanner>
          <SearchBar />
        </Banner>
      );
    case "designer":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{props.templateName + "/v1.0"}</Styledh1>
          </MobileBanner>
          <ActionButton onClick={() => { history.push("/") }}>
            <StyledButton>Finish</StyledButton>
          </ActionButton>
        </Banner>
      );
    default:
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{props.currentPageTitle}</Styledh1>
          </MobileBanner>
        </Banner>
      );
  }
}


export default connect(mapStateToProps)(NavBar);
