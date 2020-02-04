import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import { RootState } from "../../store/rootReducer";
import SearchBar from "./SearchBar/SearchBar";
import { Banner,Styledh1} from './styled';


export default function NavBar() {
 
  return (
  <Banner>
    <Styledh1> Dashboard </Styledh1> 
    <SearchBar/>
  </Banner>
  )
}

