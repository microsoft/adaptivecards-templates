import * as React from "react";
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import { setSearchBarVisible } from "../../store/search/actions";

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
}

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
        <DashboardButton
          onClick={onDashboardClick}
          tabIndex={0}>
          {GO_TO_DASHBOARD}
        </DashboardButton>
      </Centered>
    </OuterContainer>
  );
}

export default connect(null, mapDispatchToProps)(NoMatch);
