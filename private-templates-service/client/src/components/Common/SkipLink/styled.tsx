import styled from "styled-components";
import { COLORS } from "../../../globalStyles";

export const SkipLinkContainer = styled.a`
display: block;
position: absolute;
left: -999px;
top: -999px;
&: focus {  
    font-size: 0.8rem;
    padding:5px 25px 5px 25px;
    left:0;
    top:75px;
    margin-left: 40px;
    color: white;
    outline: none;
    background: ${COLORS.BLUE3};
    text-decoration: none;
};
`;