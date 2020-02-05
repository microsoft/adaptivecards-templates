import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar";
import { Banner, Styledh1, StyledLogo, MobileBanner} from './styled';
import Logo from '../../assets/adaptive-cards-100-logo.png'

export default function NavBar() {
  return (
    <Banner>
      <MobileBanner>
        <StyledLogo src = {Logo}/>
        <Styledh1> Dashboard </Styledh1> 
      </MobileBanner>
      <SearchBar/>
    </Banner>
  )
}
