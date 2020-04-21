import React from "react";
import { StyledSearchBox } from "./styled";
import { RootState } from "../../../store/rootReducer";
import { connect } from "react-redux";
import { querySearch, clearSearch } from "../../../store/search/actions";
import { COLORS, BREAK } from "../../../globalStyles";
import * as STRINGS from "../../../assets/strings";
import { clearFilter } from '../../../store/filter/actions';
import { clearSort } from '../../../store/sort/actions';
import { SEARCH, TEMPLATES } from "../../../assets/strings";


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
    },
    clearFilter: () => {
      dispatch(clearFilter());
    },
    clearSort: () => {
      dispatch(clearSort());
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
  clearFilter: () => void;
  clearSort: () => void;
}

interface State {
  isMobile: boolean;
}

const placeHolderStyles = {
  field: {
    selectors: {
      "::-webkit-input-placeholder": {
        color: COLORS.GREY_SEARCH_BAR_DARK
      },
      ":-ms-input-placeholder": {
        color: COLORS.GREY_SEARCH_BAR_DARK
      },
      "::-moz-placeholder": {
        color: COLORS.GREY_SEARCH_BAR_DARK
      },
      ":-moz-placeholder": {
        color: COLORS.GREY_SEARCH_BAR_DARK
      }
    }
  }
};

const searchIconProps = {
  style: {
    color: COLORS.GREY_SEARCH_BAR_DARK
  }
};

class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isMobile: window.screen.width < BREAK.SM };
  }

  componentDidMount() {
    window.addEventListener("resize", this.dimentionsUpdate.bind(this));
    this.onClear();
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
    this.props.clearSort();
    this.props.clearFilter();
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
          ariaLabel={STRINGS.SEARCHBAR_DESCRIPTION}
          placeholder={(`${SEARCH}${!this.state.isMobile && ` ${TEMPLATES}`}`)}
          onSearch={this.onSearch} // will trigger when "Enter" is pressed
          onClear={this.onClear} // will trigger when "Esc" or "X" is pressed
          styles={placeHolderStyles}
          iconProps={searchIconProps}
        />
      );
    }

    // return empty
    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
