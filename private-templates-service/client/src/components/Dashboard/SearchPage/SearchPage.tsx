import React from 'react';
import Filter from './Filter/Filter';
import Sort from './Sort/Sort';
import { RootState } from '../../../store/rootReducer';
import { connect } from 'react-redux';
import { SearchAndFilter, SearchResultBanner, StyledSearchText, StyledSpinner } from './styled';
import Gallery from '../../Gallery';
import PreviewModal from "../PreviewModal";
import { setPage } from "../../../store/page/actions";
import { TemplateList } from 'adaptive-templating-service-typescript-node';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

const mapStateToProps = (state: RootState) => {
  return {
    searchValue: state.search.searchValue,
    isSearch: state.search.isSearch,
    filterType: state.filter.filterType,
    sortType: state.sort.sortType,
    loading: state.search.loading,
    templates: state.search.templates
  }
}

const mapDipatchToProps = (dispatch: any) => {
  return{
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    }
  }
}

interface Props {
  searchValue: string;
  isSearch: boolean
  filterType: string;
  sortType: string;
  loading: boolean;
  templates?: TemplateList;
  setPage: (currentPageTitle: string) => void;
}

interface State{ 
  isPreviewOpen: boolean;
}

class SearchPage extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {isPreviewOpen: false};
    props.setPage("Templates");
  };
  toggleModal = () => {
    this.setState({ isPreviewOpen: !this.state.isPreviewOpen });
  };

  render() {
    if(this.props.loading){
      return(
        <StyledSpinner>
          <Spinner size = {SpinnerSize.large} />
        </StyledSpinner>
      )
    }

    let templates = undefined;
    let searchText = undefined;
    if(!this.props.loading && this.props.templates?.templates){
      templates = this.props.templates.templates;
    }
    
    if(this.props.templates?.templates?.length === 0){
      searchText = "No Results Found For " + "'" + this.props.searchValue + "'";
    }else{
      searchText = "Template Results For " + "'" + this.props.searchValue + "'";
    }
    
    return (
      <div>
        <SearchResultBanner>
          <StyledSearchText>{ searchText }</StyledSearchText>
          <SearchAndFilter>
            <Sort/>
            <Filter/>
          </SearchAndFilter>
        </SearchResultBanner>
      <h1>filter value: {this.props.filterType}</h1>
      <h1>sort value: {this.props.sortType}</h1>
      <Gallery onClick = {this.toggleModal} templates={ templates }></Gallery>
      <PreviewModal show= {this.state.isPreviewOpen} toggleModal ={this.toggleModal}/>
      </div>
      // TODO: add ability to see templates that are searched 
    );
  }
}

export default connect(mapStateToProps, mapDipatchToProps)(SearchPage);
