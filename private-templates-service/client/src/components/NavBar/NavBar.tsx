import React from "react";

import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { useHistory } from "react-router-dom";
import { openModal } from '../../store/page/actions';
import { ModalState } from '../../store/page/types';

import { Template } from "adaptive-templating-service-typescript-node";

import SearchBar from "./SearchBar";
import TooltipEditButton from "./TooltipEditButton";

import { ActionButton } from 'office-ui-fabric-react';
import Logo from '../../assets/adaptive-cards-100-logo.png';
import * as STRINGS from "../../assets/strings";

import { Banner, Styledh1, StyledLogo, MobileBanner, BaselineBanner, StyledButton, Styledh2, StyledButtonContent, EditButton, BackButton, ButtonTextWrapper } from './styled';
import { FINISH, BACK, ID, PREVIEW } from "../../assets/strings";

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
    templateID: state.currentTemplate.templateID,
    isFetching: state.currentTemplate.isFetching,
    templateName: state.currentTemplate.templateName,
    modalState: state.page.modalState
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
  templateID?: string;
  modalState?: ModalState;
}

const NavBar = (props: NavBarProps) => {

  let history = useHistory();

  if (!props.currentPage) {
    return (
      <Banner>
        <MobileBanner>
          <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
          <Styledh1>{props.currentPageTitle || ""}</Styledh1>
        </MobileBanner>
        <SearchBar />
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
            <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
            <Styledh1>{props.currentPageTitle}</Styledh1>
          </MobileBanner>
          <SearchBar />
        </Banner>
      );
    case "searchpage":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
            <Styledh1>{props.currentPageTitle}</Styledh1>
          </MobileBanner>
          <SearchBar />
        </Banner>
      );
    case "designer":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
            <Styledh1>{((props.templateID === "" || props.templateID === undefined) && STRINGS.UNTITLEDCARD) || props.templateName}</Styledh1>
            {(props.templateID !== "" && props.templateID !== undefined) && <EditButton onClick={editName} iconProps={{ iconName: 'Edit' }} />}
          </MobileBanner>
          <ActionButton onClick={() => { history.goBack() }}>
            <StyledButton>
              <StyledButtonContent>
                {FINISH}
              </StyledButtonContent>
            </StyledButton>
          </ActionButton>
        </Banner>
      );
    case "sharedpage":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
            <Styledh1>{props.template ? (props.version ? props.template.name + " - " + props.version : props.template.name) : `${PREVIEW}`}</Styledh1>
            <Styledh2>{props.template ? `${ID}: ` + props.template.id : ""}</Styledh2>
          </MobileBanner>
        </Banner>
      );
    case "template":
      return (
        <Banner>
          <BaselineBanner>
            <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
            <Styledh1>{(props.template && props.template.name) || props.currentPageTitle}</Styledh1>
            {!props.isFetching && <TooltipEditButton editName={editName} modalState={props.modalState} />}
          </BaselineBanner>
          <BackButton iconProps={{ iconName: 'Back' }} onClick={onBackButton} tabIndex={props.modalState ? -1 : 0} ><ButtonTextWrapper>{BACK}</ButtonTextWrapper></BackButton>
        </Banner>
      );
    case "all cards":
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo src={Logo} />
            <Styledh1>{props.currentPageTitle}</Styledh1>
          </MobileBanner>
          <SearchBar />
        </Banner>
      );
    default:
      return (
        <Banner>
          <MobileBanner>
            <StyledLogo aria-label={STRINGS.LOGO_DESCRIPTION} src={Logo} />
            <Styledh1>{props.currentPageTitle}</Styledh1>
          </MobileBanner>
        </Banner>
      );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
