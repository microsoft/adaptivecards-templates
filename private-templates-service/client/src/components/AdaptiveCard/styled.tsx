import styled from "styled-components";

export const Card = styled.div`
	/* Disables buttons on adaptive card */
	pointer-events: none;
	background: #d3d3d3;
	border-top: 5px;
	border-top-color: grey;
	border-radius: 5px 5px 0 0px;
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 20px;

	background: white;
	border-radius: 5px;
	width: 350px;

	--webkit-box-shadow: 0px 1px 5px -3px rgba(189, 187, 189, 1);
	-moz-box-shadow: 0px 1px 5px -3px rgba(189, 187, 189, 1);
	box-shadow: 0px 1px 5px -3px rgba(189, 187, 189, 1);

	@media only screen and (max-width: 1200px) {
		margin-bottom: 25px;
	}
`;

export const TemplateName = styled.h2`
	border-top-style: solid;
	border-top-color: grey;
	border-width: 1px;
	padding: 10px 0 5px 10px;
	font-size: 0.75rem;
	color: grey;
`;

export const Bottom = styled.div`
	padding: 20px;
`;
