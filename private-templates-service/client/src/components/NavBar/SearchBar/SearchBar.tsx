import React from 'react';
import { StyledSearchBox } from './styled';
import { RootState } from '../../../store/rootReducer';
import { connect } from 'react-redux';
import { search, clearSearch } from '../../../store/search/actions';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { THEME, BREAK } from '../../../globalStyles';

const mapStateToProps = (state:RootState) => {
  return {
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

interface State {
  isMobile: boolean;
}

class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isMobile: window.screen.width < BREAK.SM};
    initializeIcons(); // to initilize the icons being used
  }

  componentDidMount() {
    window.addEventListener('resize', this.dimentionsUpdate.bind(this));
  }

  dimentionsUpdate = (e: Event) => {
    if(!this.state.isMobile && window.innerWidth < BREAK.SM) {
      this.setState({isMobile: true});
    }
    else if(this.state.isMobile && window.innerWidth >= BREAK.SM) {
      this.setState({isMobile: false});
    }
  }

  onClear = () => {
    this.props.clearSearch();
  }

  onSearch = (searchValue: string) => {
    if(searchValue === "") {
      this.props.clearSearch();
    } 
    else {
      this.props.search(searchValue);
    }
  }

  render() {
    if(this.props.isAuthenticated) {
      return( 
        <StyledSearchBox
          placeholder = {"search" + (this.state.isMobile ? "" : " templates")}
          onSearch = {this.onSearch} // will trigger when "Enter" is pressed
          onClear = {this.onClear} // will trigger when "Esc" or "X" is pressed
          theme = {THEME.DARK}
        />
      );
    }
      
    // return empty 
    return (<React.Fragment/>);
   
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
