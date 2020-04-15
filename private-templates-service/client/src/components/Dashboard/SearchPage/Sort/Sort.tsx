import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledSortDropdown } from "./styled";
import { clearSort, querySort } from '../../../../store/sort/actions';
import { THEME } from '../../../../globalStyles';
import { SortType } from "../../../../store/sort/types";

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    sortType: state.sort.sortType,
    searchByTemplateName: state.search.searchByTemplateName
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    querySort: (sortType: SortType ) => {
      dispatch(querySort(sortType));
    }
  }
}

interface Props {
  isSearch: boolean;
  sortType: SortType;
  querySort: (sortType: SortType) => void;
  // clear sort will be implemented there are design confirmations from Naomi
}

const options: IDropdownOption[] = [
  { key: 'dateCreated', text: "Date Created" },
  { key: "dateUpdated", text: "Date Updated" },
  { key: "alphabetical", text: "Alphabetical" }
];

class Sort extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      if( option.key === "alphabetical" || option.key ==="dateCreated" || option.key === "dateUpdated"){
        this.props.querySort(option.key);
      }
    }
  }

  render() {
    return (
      <StyledSortDropdown
        placeHolder="Sort by"
        options={options}
        onChange={this.onChange}
        theme={THEME.LIGHT}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
