import styled from "styled-components";
import { PrimaryButton } from 'office-ui-fabric-react';

import { FONTS } from "../../../globalStyles";

export const PlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

export const PlaceholderText = styled.h5`
  font-family: ${FONTS.SEGOE_UI_REGULAR};
  padding-top: 20px;
`;

export const PlaceholderButton = styled(PrimaryButton)`
  margin-top: 24px;
`;
