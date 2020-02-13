import React from "react";
import { IDropdownOption} from 'office-ui-fabric-react/lib/Dropdown';
import { RootState } from "../../../store/rootReducer";
import { connect } from 'react-redux';
import { StyledSortDropdown } from "./styled";

const mapStateToProps = (state:RootState) => {
  return {
    isSearch: state.search.isSearch
  }
}

interface Props{
  isSearch : boolean;
}

const options: IDropdownOption[] = [
  {key: 'date created', text: "Date Created"},
  {key: "date updated", text: "Date Updated"},
  {key: "alphabetical", text: "Alphabetical"}
];

class Sort extends React.Component<Props> {
  constructor(props: Props){
    super(props);
  }

  render() {
    if( this.props.isSearch === true){
      return(
        <StyledSortDropdown
          placeHolder = "Sort by"
          options = {options}
        />
      );
    }
    return(<React.Fragment/>);
  }
}

export default connect(mapStateToProps)(Sort);