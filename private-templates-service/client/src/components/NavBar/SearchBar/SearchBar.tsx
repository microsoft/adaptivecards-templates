import React, {useState} from 'react';
import {StyledSearchBox} from './styled';
import { RootState } from '../../../store/rootReducer';
import { connect } from 'react-redux';
import { search, clearSearch } from '../../../store/search/actions';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons(); // to initilize the icons being used

const mapStateToProps = (state:RootState) => {

  return{
    isSearch: state.search.isSearch,
    searchValue: state.search.searchValue,
    isAuthenticated :state.auth.isAuthenticated
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    search: (searchValue: string) => {
      dispatch(search(searchValue));
    },
    clearSearch: () => {
      dispatch(clearSearch());
    }
  }
}

interface Props { 
  isSearch: boolean,
  searchValue: string,
  isAuthenticated: boolean;
  search: (searchValue: string) => void,
  clearSearch: () => void,
}
function SearchBar(props: Props) {


  const onClear = () => {
    console.log("clear is triggered");
    props.clearSearch();
  }

  const onSearch = (searchValue: string) => {
    
    console.log("search is querieid");
    if(searchValue === ""){
      props.clearSearch();
    } 
    else{
      props.search(searchValue);
    }
  }

  if(props.isAuthenticated){
  return( 
 
      <StyledSearchBox
        placeholder = " Search Adaptive Cards"
        onSearch = {onSearch} // will trigger when "Enter" is pressed

        onFocus={() => console.log('onFocus called')}
        onChange={() => console.log('onChange called')}
        onClear = {onClear} // will trigger when "Esc" or "X" is pressed
      />
    );
  }
  
  else{
    return (<React.Fragment/>)
  }// return empty

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);