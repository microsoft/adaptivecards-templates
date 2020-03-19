import React from "react";

import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { useHistory } from "react-router-dom";
import { openModal } from '../../store/page/actions';
import { ModalState } from '../../store/page/types';

import { Template } from "adaptive-templating-service-typescript-node";

import SearchBar from "./SearchBar";

import { ActionButton } from 'office-ui-fabric-react';
import Logo from '../../assets/adaptive-cards-100-logo.png';

import { Banner, Styledh1, StyledLogo, MobileBanner, BaselineBanner, StyledButton, Styledh2, StyledButtonContent, EditButton, BackButton, ButtonTextWrapper } from './styled';

const mapDispatchToProps = (dispatch: any) => {
  return {
    openModal: () => {
      dispatch(openModal(ModalState.EditName));
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle,
    currentPage: state.page.currentPage,
    template: state.currentTemplate.template,
    // templateName: state.currentTemplate.templateName,
    isFetching: state.currentTemplate.isFetching
  }
}

interface NavBarProps {
  openModal: () => void;
  currentPageTitle?: string;
  currentPage?: string;
  template?: Template;
  templateName?: string;
  isFetching: boolean;
  version?: string;
}


const NavBar = (props: NavBarProps) => {

  let history = useHistory();

  if (!props.currentPage) {
    return (
      <Banner>
        <MobileBanner>
          <StyledLogo src={Logo} />
          <Styledh1>{props.currentPageTitle || ""}</Styledh1>
        </MobileBanner>
      </Banner>
    );
  }

  const editName = () => {
    props.openModal();
  }

  const onBackButton = () => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.replace('/')
    }
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
    case "template":
      return (
        <Banner>
          <BaselineBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{(props.template && props.template.name) || props.currentPageTitle}</Styledh1>
            {!props.isFetching && <EditButton onClick={editName} iconProps={{ iconName: 'Edit' }} />}
          </BaselineBanner>
          <BackButton iconProps={{ iconName: 'Back' }} onClick={onBackButton}><ButtonTextWrapper>Back</ButtonTextWrapper></BackButton>
        </Banner>
      );
    default:
      return (
        <Banner>
          <BaselineBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{(props.template && props.template.name) || props.currentPageTitle}</Styledh1>
          </BaselineBanner>
        </Banner>
      );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
