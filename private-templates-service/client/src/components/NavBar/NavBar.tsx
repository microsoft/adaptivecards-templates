import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar";
import { Banner, Styledh1, StyledLogo, MobileBanner, StyledButton, Styledh2, StyledButtonContent } from './styled';
import Logo from '../../assets/adaptive-cards-100-logo.png';
import { ActionButton } from "office-ui-fabric-react";
import { useHistory } from "react-router-dom";
import { Template } from "adaptive-templating-service-typescript-node";

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle,
    currentPage: state.page.currentPage,
    template: state.currentTemplate.template
  }
}

interface NavBarProps {
  currentPageTitle?: string;
  currentPage?: string;
  template?: Template;
  version?: string;
}


const NavBar = (props: NavBarProps) => {

  let history = useHistory();

  if (!props.currentPage) {
    return (
      <Banner>
        <MobileBanner>
          <StyledLogo src={Logo} />
          <Styledh1>{props.currentPageTitle}</Styledh1>
        </MobileBanner>
      </Banner>
    );
  }

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
    case "searchpage":
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
            <Styledh1>{props.template ? props.template.name : props.currentPageTitle}</Styledh1>
            <Styledh2>{props.version ? "Version " + props.version : ""}</Styledh2>
          </MobileBanner>
          <ActionButton onClick={() => { history.push("/") }}>
            <StyledButton>
              <StyledButtonContent>
                Finish
              </StyledButtonContent>
            </StyledButton>
          </ActionButton>
        </Banner>
      );
    case "sharedpage":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{props.template ? (props.version ? props.template.name + " - " + props.version : props.template.name) : "Preview"}</Styledh1>
            <Styledh2>{props.template ? "ID: " + props.template.id : ""}</Styledh2>
          </MobileBanner>
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
