import styled from "styled-components";
import { COLORS } from "../../../globalStyles";

import { Link } from 'office-ui-fabric-react';

export const FooterOuterContainer = styled.div`
  height: 60px;
  background-color: ${COLORS.GREY1};
`;

export const FooterContainer = styled.div`
  padding: 0px 10px;
  height: 100%;
  display: flex;
`;

export const FooterContents = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  margin: auto;
`;

export const FooterLink = styled(Link)`
  padding: 0px 10px;
  color: ${COLORS.BLACK};
  font-size: 0.875rem;
`;
