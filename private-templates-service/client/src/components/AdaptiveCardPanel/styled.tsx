import styled from "styled-components";
import { COLORS } from '../../globalStyles';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 20px;

	background: white;
	border-radius: 5px;
  width: 350px;

  -webkit-box-shadow: 0px 2px 6px 0px rgba(111,111,111,0.4);
  -moz-box-shadow: 0px 2px 6px 0px rgba(111,111,111,0.4);
  box-shadow: 0px 2px 6px 0px rgba(111,111,111,0.4);

	@media only screen and (max-width: 1399px) {
		margin-bottom: 20px;
	}
`;

export const ACWrapper = styled.div`
  padding: 16px 16px 0;
  border-radius: 5px 5px 0 0;
`;

export const TemplateName = styled.h2`
	border-top-style: solid;
	border-top-color: ${COLORS.BORDER};
	border-width: 1px;
	padding: 10px 0 5px 10px;
	font-size: 0.75rem;
	color: grey;
`;

export const Bottom = styled.div`
	padding: 20px;
`;
