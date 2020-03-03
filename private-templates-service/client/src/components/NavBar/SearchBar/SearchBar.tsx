import React from "react";
import { StyledSearchBox, GREY_SEARCH_BAR_LIGHT, GREY_SEARCH_BAR_DARK } from "./styled";
import { RootState } from "../../../store/rootReducer";
import { connect } from "react-redux";
import { querySearch, clearSearch } from "../../../store/search/actions";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { COLORS, THEME, BREAK } from "../../../globalStyles";
import { IStyle } from "office-ui-fabric-react";

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    searchValue: state.search.searchValue,
    isAuthenticated: state.auth.isAuthenticated,
    isSearchBarVisible: state.search.isSearchBarVisible,
    searchByTemplateName: state.search.searchByTemplateName
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    search: (searchByTemplateName: string) => {
      dispatch(querySearch(searchByTemplateName));
    },
    clearSearch: () => {
      dispatch(clearSearch());
    }
  };
};

interface Props {
  isSearch: boolean;
  searchByTemplateName: string;
  isAuthenticated: boolean;
  isSearchBarVisible?: boolean;
  search: (searchByTemplateName: string) => void;
  clearSearch: () => void;
}

interface State {
  isMobile: boolean;
}

const placeHolderStyles = {
  field: {
    selectors: {
      "::-webkit-input-placeholder": {
        color: GREY_SEARCH_BAR_DARK
      },
      ":-ms-input-placeholder": {
        color: GREY_SEARCH_BAR_DARK
      },
      "::-moz-placeholder": {
        color: GREY_SEARCH_BAR_DARK
      },
      ":-moz-placeholder": {
        color: GREY_SEARCH_BAR_DARK
      }
    }
  }
};

const searchIconProps = {
  style: {
    color: GREY_SEARCH_BAR_DARK
  }
};

class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isMobile: window.screen.width < BREAK.SM };
    initializeIcons(); // to initilize the icons being used
  }

  componentDidMount() {
    window.addEventListener("resize", this.dimentionsUpdate.bind(this));
  }

  dimentionsUpdate = (e: Event) => {
    if (!this.state.isMobile && window.innerWidth < BREAK.SM) {
      this.setState({ isMobile: true });
    } else if (this.state.isMobile && window.innerWidth >= BREAK.SM) {
      this.setState({ isMobile: false });
    }
  };

  onClear = () => {
    this.props.clearSearch();
  };

  onSearch = (searchByTemplateName: string) => {
    if (searchByTemplateName === "") {
      this.props.clearSearch();
    } else {
      this.props.search(searchByTemplateName);
    }
  };

  render() {
    if (this.props.isAuthenticated && this.props.isSearchBarVisible) {
      return (
        <StyledSearchBox
          placeholder={"search" + (this.state.isMobile ? "" : " templates")}
          onSearch={this.onSearch} // will trigger when "Enter" is pressed
          onClear={this.onClear} // will trigger when "Esc" or "X" is pressed
          styles={placeHolderStyles}
          iconProps={searchIconProps}
        />
      );
    }

    // return empty
    return <React.Fragment />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
