import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledFilterDropdown } from './styled';
import { clearFilter, queryFilter } from "../../../../store/filter/actions";
import { THEME } from '../../../../globalStyles';
import { FilterObject } from '../../../../store/filter/types';
import { FilterEnum } from '../../../../store/filter/types';

const mapStateToProps = (state: RootState) => {
  return {
    searchByTemplateName: state.search.searchByTemplateName,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearFilter: () => {
      dispatch(clearFilter());
    },
    queryFilter: (filterType: FilterObject) => {
      dispatch(queryFilter(filterType));
    }
  }
}

interface Props {
  queryFilter: (filterType: FilterObject) => void;
  // clear filter will be implemented once design has been confirmed by Naomi
}

const options: IDropdownOption[] = [
  { key: 'owner', text: "Created by me" },
  { key: "draft", text: "Draft" },
  { key: "published", text: "Published" }
];
class Filter extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      let filter: FilterObject  = { value: option.key, owner: undefined, state: undefined }
      if (option.key === "owner"){
        filter.owner = true;
      }
      else if (option.key === "draft"){
        filter.state = "draft";
      }
      else if(option.key === "published"){ 
        filter.state = "live";
      }
      this.props.queryFilter(filter)
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
