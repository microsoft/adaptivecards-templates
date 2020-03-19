import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledSortDropdown } from "./styled";
import { clearSort, querySort } from '../../../../store/sort/actions';
import { THEME } from '../../../../globalStyles';

const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    sortType: state.sort.sortType
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearSort: () => {
      dispatch(clearSort());
    },
    querySort: (sortType: string) => {
      dispatch(querySort(sortType));
    }
  }
}

interface Props {
  isSearch: boolean;
  sortType: string;
  querySort: (sortType: string) => void;
  clearSort: () => void;
}

const options: IDropdownOption[] = [
  { key: 'date created', text: "Date Created" },
  { key: "date updated", text: "Date Updated" },
  { key: "alphabetical", text: "Alphabetical" }
];

class Sort extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      this.props.querySort(option.key);
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
