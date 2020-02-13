import React from "react";
import { IDropdownOption} from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledFilterDropdown } from './styled';

const mapStateToProps = (state:RootState) => {
  return {
    isSearch: state.search.isSearch
  }
}

interface Props{
  isSearch : boolean;
}

const options: IDropdownOption[] = [
  {key: 'created by me', text: "Created by me"},
  {key: "draft", text: "Draft"},
  {key: "published", text: "Published"}
];

class Filter extends React.Component<Props> {
  constructor(props: Props){
    super(props);
  }

  render() {
    if(this.props.isSearch === true){
      return(
        <StyledFilterDropdown
          placeHolder = "Filter by"
          options = {options}
        />
      );
    }
    return(<React.Fragment/>);
  }
}

export default connect(mapStateToProps)(Filter);