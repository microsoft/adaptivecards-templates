import * as React from "react";
import { useHistory } from "react-router-dom";
import { Centered, OuterContainer, ErrorWrapper, ErrorMessage, DashboardButton } from "./styled";
import { TAG_ERROR_MESSAGE, TAG_GO_TO_DASHBOARD } from "../../assets/strings";



const NoMatch = () => {
  const history = useHistory();

  const onDashboardClick = () => {
    history.push("/");
  }

  return (
    <OuterContainer>
      <Centered>
        <ErrorWrapper>404</ErrorWrapper>
        <ErrorMessage>{TAG_ERROR_MESSAGE}</ErrorMessage>
        <DashboardButton
          onClick={onDashboardClick}
          tabIndex={0}>
          {TAG_GO_TO_DASHBOARD}
        </DashboardButton>
      </Centered>
    </OuterContainer>
  );
}

export default NoMatch;
