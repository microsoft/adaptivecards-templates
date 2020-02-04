import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar/SearchBar";
import { Banner,Styledh1,Logo,MobileBanner} from './styled';
import logo from '../../assets/adaptive-cards-100-logo.png'

export default function NavBar() {
  return (
    <Banner>
      <MobileBanner>
      <Logo src = {logo}/>
      <Styledh1> Dashboard </Styledh1> 
      </MobileBanner>
      <SearchBar/>
    </Banner>
  )
}

