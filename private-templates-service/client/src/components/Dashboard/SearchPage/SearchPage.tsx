import React from 'react';
import Filter from './Filter/Filter';
import Sort from './Sort/Sort';
import { RootState } from '../../../store/rootReducer';
import { connect } from 'react-redux';
import { SearchAndFilter, SearchResultBanner, StyledSearchText, StyledSpinner } from './styled';
import Gallery from '../../Gallery';
import PreviewModal from "../PreviewModal";
import { setPage } from "../../../store/page/actions";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { Template, TemplateList } from "adaptive-templating-service-typescript-node";

const mapStateToProps = (state: RootState) => {
  return {
    searchByTemplateName: state.search.searchByTemplateName,
    isSearch: state.search.isSearch,
    filterType: state.filter.filterType,
    sortType: state.sort.sortType,
    loading: state.search.loading,
    templates: state.search.templates,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    }
  }
}

interface Props {
  searchByTemplateName: string;
  isSearch: boolean
  filterType: string;
  sortType: string;
  loading: boolean;
  templates?: TemplateList;
  setPage: (currentPageTitle: string, currentPage: string) => void;
}

interface State {
  isPreviewOpen: boolean;
}

class SearchPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isPreviewOpen: false };
    props.setPage("Templates", "searchPage");
  };
  toggleModal = () => {
    this.setState({ isPreviewOpen: !this.state.isPreviewOpen });
  };

  render() {
    if (this.props.loading) {
      return (
        <StyledSpinner>
          <Spinner size={SpinnerSize.large} />
        </StyledSpinner>
      )
    }

    let templates = new Array<Template>();
    let searchText = "";
    if (!this.props.loading && this.props.templates?.templates) {
      templates = this.props.templates.templates;
    }

    if (this.props.templates?.templates?.length === 0) {
      searchText = "No Results Found For " + "'" + this.props.searchByTemplateName + "'";
    } else {
      searchText = "Template Results For " + "'" + this.props.searchByTemplateName + "'";
    }

    return (
      <div>
        <SearchResultBanner>
          <StyledSearchText>{searchText}</StyledSearchText>
          <SearchAndFilter>
            <Sort />
            <Filter />
          </SearchAndFilter>
        </SearchResultBanner>
        <h1>filter value: {this.props.filterType}</h1>
        <h1>sort value: {this.props.sortType}</h1>
        <Gallery onClick={this.toggleModal} templates={templates}></Gallery>
        <PreviewModal show={this.state.isPreviewOpen} toggleModal={this.toggleModal} />
      </div>
      // TODO: add ability to see templates that are searched 
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
