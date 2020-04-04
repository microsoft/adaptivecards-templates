import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledSortDropdown } from "./styled";
import { clearSort, querySort } from '../../../../store/sort/actions';
import { THEME } from '../../../../globalStyles';
import { querySearch } from "../../../../store/search/actions";

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    sortType: state.sort.sortType,
    searchByTemplateName: state.search.searchByTemplateName
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearSort: () => {
      dispatch(clearSort());
    },
    querySort: (sortType: string) => {
      dispatch(querySort(sortType));
    },
    querySearch: (templateName: string, sortBy: "alphabetical" | "dateCreated" | "dateUpdated" | undefined,) => { 
      dispatch(querySearch(templateName,sortBy));
    }
  }
}

interface Props {
  isSearch: boolean;
  sortType: string;
  searchByTemplateName: string;
  querySort: (sortType: string) => void;
  clearSort: () => void;
  querySearch: (templateName: string, sortBy: "alphabetical" | "dateCreated" | "dateUpdated" | undefined) => void;
}

const options: IDropdownOption[] = [
  { key: 'dateCreated', text: "Date Created" },
  { key: "dateUpdated", text: "Date Updated" },
  { key: "alphabetical", text: "Alphabetical" }
];

class Sort extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      this.props.querySort(option.key);
      if (option.key === "alphabetical" || option.key === "dateCreated" || option.key === "dateUpdated") {
        this.props.querySearch(this.props.searchByTemplateName,option.key)
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
