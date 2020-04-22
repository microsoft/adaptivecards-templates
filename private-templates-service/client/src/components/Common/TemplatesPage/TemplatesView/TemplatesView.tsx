// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { SpinnerSize } from "office-ui-fabric-react";
import { RootState } from "../../../../store/rootReducer";
import { AllTemplateState } from "../../../../store/templates/types";
import { ViewToggleState, ViewType } from "../../../../store/viewToggle/types";
import { Template } from "adaptive-templating-service-typescript-node";

// Components
import { CenteredSpinner } from "../../../Dashboard/styled";
import Gallery from "../../../Gallery";
import TemplateList from "../../../Dashboard/TemplateList";
import RecentlyEditedPlaceholder from '../../../Dashboard/RecentlyEditedPlaceholder';

// Strings
import { ALL_CARDS } from "../../../../assets/strings";
import { SearchState } from "../../../../store/search/types";
import { FilterObject, FilterEnum } from "../../../../store/filter/types";
import { SortType } from "../../../../store/sort/types";
import { RouteComponentProps, withRouter } from "react-router-dom";

const mapStateToProps = (state: RootState) => {
  return {
    templates: state.allTemplates,
    toggleState: state.allCardsViewToggle,
    filter: state.filter.filterType,
    search: state.search,
    sort: state.sort.sortType
  };
};
interface Props extends RouteComponentProps{
  onClick: (templateID: string) => void;
  getTemplates: (tags?: string[], ifOwned?: boolean, name?: string, sortBy?: SortType, filterState?: FilterEnum) => void;
  templates: AllTemplateState;
  toggleState: ViewToggleState;
  selectedTags: string[];
  search: SearchState;
  filter: FilterObject;
  sort: SortType;
  basePath: string;
}

export class TemplatesView extends Component<Props> {

  componentDidMount() {
    this.props.getTemplates(this.props.selectedTags, this.props.filter.owner, this.props.search.query, this.props.sort, this.props.filter.state);
  }

  componentDidUpdate(prevProps: Props) {
    const props: Props = this.props;
    if (prevProps.selectedTags.length !== props.selectedTags.length
           || prevProps.filter.owner !== props.filter.owner
           || prevProps.filter.state !== props.filter.state
           || prevProps.sort !== props.sort
           || prevProps.search.query !== props.search.query
       ) {
         this.props.getTemplates(this.props.selectedTags, this.props.filter.owner, this.props.search.query, this.props.sort, this.props.filter.state);
        }
  }

  render() {
    const { toggleState, onClick } = this.props;
    let templatesState: AllTemplateState = this.props.templates;
    let templates: Template[] = [];
    if (!templatesState.isFetching && templatesState.templates && templatesState.templates.templates) {
      templates = templatesState.templates.templates;
    }
    return (
      <section aria-label={ALL_CARDS}>
        {templatesState.isFetching ? (
          <CenteredSpinner size={SpinnerSize.large} />
        ) : (
            toggleState.viewType === ViewType.List ? (
              <TemplateList templates={templates} displayComponents={{ author: true, dateModified: true, templateName: true, status: true, version: false }} onClick={onClick} />
            ) : (
                templates.length ? (
                  <Gallery onClick={onClick} templates={templates} />
                )
                  : (
                    <RecentlyEditedPlaceholder />
                  )
              )
          )}
      </section>
    );
  }
}

export default connect(mapStateToProps)(withRouter(TemplatesView));
