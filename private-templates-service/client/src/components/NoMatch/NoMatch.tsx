import * as React from "react";
import { connect } from 'react-redux';
import { RootState } from "../../store/rootReducer";
import { useHistory } from "react-router-dom";

import { setSearchBarVisible } from "../../store/search/actions";
import { ModalState } from "../../store/page/types";


import { Centered, OuterContainer, ErrorWrapper, ErrorMessage, DashboardButton } from "./styled";
import { ERROR_MESSAGE, GO_TO_DASHBOARD } from "../../assets/strings";

const mapDispatchToProps = (dispatch: any) => {
  return {
    setSearchBarVisible: (isSearchBarVisible: boolean) => {
      dispatch(setSearchBarVisible(isSearchBarVisible));
    },
  }
}

interface Props {
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  modalState?: ModalState;
}

const mapStateToProps = (state: RootState) => {
  return {
    modalState: state.page.modalState
  };
};

const NoMatch = (props: Props) => {
  props.setSearchBarVisible(true);
  const history = useHistory();

  const onDashboardClick = () => {
    history.push("/");
  }

  return (
    <OuterContainer>
      <Centered>
        <ErrorWrapper>404</ErrorWrapper>
        <ErrorMessage>{ERROR_MESSAGE}</ErrorMessage>
        <DashboardButton key={GO_TO_DASHBOARD}
          onClick={onDashboardClick}
          tabIndex={props.modalState ? -1 : 0}
          ariaDescription={GO_TO_DASHBOARD}>
          {GO_TO_DASHBOARD}
        </DashboardButton>
      </Centered>
    </OuterContainer>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NoMatch);
