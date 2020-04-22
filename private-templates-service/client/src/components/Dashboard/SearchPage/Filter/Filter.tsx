import React from "react";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { connect } from 'react-redux';
import { StyledFilterDropdown } from './styled';
import { clearFilter, queryFilter } from "../../../../store/filter/actions";
import { THEME } from '../../../../globalStyles';
import { FilterObject } from '../../../../store/filter/types';
import { OWNER_KEY, CREATED_BY_ME, FILTER_DRAFT, DRAFT_KEY, PUBLISHED_KEY, FILTER_PUBLISHED, FILTER_LIVE, FILTER_BY } from "../../../../assets/strings";

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
  { key: OWNER_KEY, text: CREATED_BY_ME },
  { key: DRAFT_KEY, text: FILTER_DRAFT },
  { key: PUBLISHED_KEY, text: FILTER_PUBLISHED }
];
class Filter extends React.Component<Props> {
  onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option && typeof option.key === "string") {
      let filter: FilterObject = { value: option.key, owner: undefined, state: undefined }
      if (option.key === OWNER_KEY) {
        filter.owner = true;
      }
      else if (option.key === DRAFT_KEY) {
        filter.owner = true;
        filter.state = DRAFT_KEY;
      }
      else if (option.key === PUBLISHED_KEY) {
        filter.state = FILTER_LIVE;
        filter.owner = undefined;
      }
      this.props.queryFilter(filter)
    }
  }

  render() {
    return (
      <StyledFilterDropdown
        placeholder={FILTER_BY}
        options={options}
        onChange={this.onChange}
        theme={THEME.LIGHT}
      />
    );
  }
}

export default connect(null, mapDispatchToProps)(Filter);
