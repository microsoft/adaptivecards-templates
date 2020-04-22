import React from "react";
import { StyledSearchBox } from "./styled";
import { RootState } from "../../../store/rootReducer";
import { connect } from "react-redux";
import { clearSearch, querySearchSet } from "../../../store/search/actions";
import { FilterObject } from "../../../store/filter/types";
import { SortType } from "../../../store/sort/types";
import { COLORS, BREAK } from "../../../globalStyles";
import * as STRINGS from "../../../assets/strings";
import { clearFilter } from '../../../store/filter/actions';
import { clearSort } from '../../../store/sort/actions';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { buildAdressBarURL } from "../../../utils/queryUtil";
import { SEARCH, TEMPLATES } from "../../../assets/strings";
import { allTemplatesURL } from "../../SideBar/SideBar";


const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    query: state.search.query,
    filter: state.filter.filterType,
    sort: state.sort.sortType,
    selectedTags: state.tags.selectedTags

  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    search: (query: string) => {
      dispatch(querySearchSet(query));
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

interface Props extends RouteComponentProps {
  query: string | undefined;
  isAuthenticated: boolean;
  isSearchBarVisible?: boolean;
  selectedTags: string[];
  filter: FilterObject;
  sort: SortType;
  search: (query: string) => void;
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

  onSearch = (query: string | undefined) => {
    if (!query) {
      this.props.clearSearch();
    } else {
      this.props.search(query);
      this.props.history.push(buildAdressBarURL(allTemplatesURL, this.props.selectedTags, this.props.filter.owner, this.props.query, this.props.sort, this.props.filter.state));
    }
  };

  render() {
    if (this.props.isAuthenticated) {
      return (
        <StyledSearchBox
          ariaLabel={STRINGS.SEARCHBAR_DESCRIPTION}
          placeholder={`${SEARCH}${!this.state.isMobile && ` ${TEMPLATES}`}`}
          value={this.props.query ? this.props.query : ""}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchBar));
