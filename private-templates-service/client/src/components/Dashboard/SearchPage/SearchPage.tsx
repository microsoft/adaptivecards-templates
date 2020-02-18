import React from 'react';
import Filter from './Filter/Filter';
import Sort from './Sort/Sort';
import { RootState } from '../../../store/rootReducer';
import { connect } from 'react-redux';
import { SearchAndFilter, SearchResultBanner, StyledSearchText } from './styled';

const mapStateToProps = (state: RootState) => {
  return {
    searchValue: state.search.searchValue,
    isSearch: state.search.isSearch,
    filterType: state.filter.filterType,
    sortType: state.sort.sortType
  }
}

interface Props {
  searchValue: string;
  isSearch: boolean
  filterType: string;
  sortType: string;
}

class SearchPage extends React.Component<Props> {
  constructor(props: Props){
    super(props);
  };

  render() {
    return (
      <div>
        <SearchResultBanner>
          <StyledSearchText>Template Results for '{this.props.searchValue}'</StyledSearchText>
          <SearchAndFilter>
            <Sort/>
            <Filter/>
          </SearchAndFilter>
        </SearchResultBanner>
      <h1>filter value: {this.props.filterType}</h1>
      <h1>sort value: {this.props.sortType}</h1>
      </div>
      // TODO: add ability to see templates that are searched 
    );
  }
}

export default connect(mapStateToProps)(SearchPage);
