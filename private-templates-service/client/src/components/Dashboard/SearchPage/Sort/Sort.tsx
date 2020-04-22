import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledSortDropdown } from "./styled";
import { querySort } from '../../../../store/sort/actions';
import { THEME } from '../../../../globalStyles';
import { SortType } from "../../../../store/sort/types";
import { DATE_CREATED, ALPHABETICAL, DATE_UPDATED, DATE_CREATED_KEY, DATE_UPDATED_KEY, ALPHABETICAL_KEY, SORT_BY } from "../../../../assets/strings";

const mapStateToProps = (state: RootState) => {
  return {
    sortType: state.sort.sortType
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    querySort: (sortType: SortType) => {
      dispatch(querySort(sortType));
    }
  }
}

interface Props {
  sortType: SortType;
  querySort: (sortType: SortType) => void;
  // clear sort will be implemented there are design confirmations from Naomi
}

const options: IDropdownOption[] = [
  { key: DATE_CREATED_KEY, text: DATE_CREATED },
  { key: DATE_UPDATED_KEY, text: DATE_UPDATED },
  { key: ALPHABETICAL_KEY, text: ALPHABETICAL }
];

class Sort extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      if (option.key === ALPHABETICAL_KEY || option.key === DATE_CREATED_KEY || option.key === DATE_UPDATED_KEY) {
        this.props.querySort(option.key);
      }
    }
  }

  render() {
    return (
      <StyledSortDropdown
        placeHolder={SORT_BY}
        options={options}
        onChange={this.onChange}
        theme={THEME.LIGHT}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
