import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledFilterDropdown } from './styled';
import { clearFilter, queryFilter } from "../../../../store/filter/actions";
import { THEME } from '../../../../globalStyles';
import { querySearch } from "../../../../store/search/actions";

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    filterType: state.filter.filterType,
    searchByTemplateName: state.search.searchByTemplateName
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearFilter: () => {
      dispatch(clearFilter());
    },
    queryFilter: (filterType: string) => {
      dispatch(queryFilter(filterType));
    },
    querySearch: (templateName: string, sortBy: "alphabetical" | "dateCreated" | "dateUpdated" | undefined) => { 
      dispatch(querySearch(templateName,sortBy));
    }
  }
}

interface Props {
  isSearch: boolean;
  filterType: string;
  queryFilter: (filterType: string) => void;
  clearFilter: () => void;
  querySearch: (templateName: string, sortBy: "alphabetical" | "dateCreated" | "dateUpdated" | undefined) => void;
}

const options: IDropdownOption[] = [
  { key: 'created by me', text: "Created by me" },
  { key: "draft", text: "Draft" },
  { key: "published", text: "Published" }
];

class Filter extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      this.props.queryFilter(option.key);
    }
  }

  render() {
    return (
      <StyledFilterDropdown
        placeholder="Filter by"
        options={options}
        onChange={this.onChange}
        theme={THEME.LIGHT}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
