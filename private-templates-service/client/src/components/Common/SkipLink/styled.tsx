import styled from "styled-components";
import { COLORS } from "../../../globalStyles";

export const SkipLinkContainer = styled.a`
display: block;
position: absolute;
left: -999px;
top: -999px;
&: focus {  
    padding:0 25px 0 25px;
    left:0;
    top:75px;
    margin-left: 40px;
    color: black;
    outline: none;
    background: white;
    text-decoration: none;
};
&: hover {
    color: ${COLORS.BLUE};
};
`;