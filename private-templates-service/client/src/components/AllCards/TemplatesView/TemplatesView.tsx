// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { SpinnerSize } from "office-ui-fabric-react";
import { RootState } from "../../../store/rootReducer";
import { AllTemplateState } from "../../../store/templates/types";
import { ViewToggleState, ViewType } from "../../../store/viewToggle/types";
import { getAllTemplates, getTemplatesByNameAndTags } from "../../../store/templates/actions";
// import { querySearchAllCards } from "../../../store/search/actions"
// Components
import { CenteredSpinner, PlaceholderText } from "../../Dashboard/styled";
import { Template } from "adaptive-templating-service-typescript-node";
import Gallery from "../../Gallery";
import TemplateList from "../../Dashboard/TemplateList";
// Strings
import { ALL_CARDS_PLACEHOLDER } from "../../../assets/strings";
import { SearchState } from "../../../store/search/types";

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTemplates: () => {
      dispatch(getAllTemplates());
    },
    getSelectedTemplates: (name?:string, tags?: string[]) => {
      if(!tags) {
        tags = undefined;
      }
      dispatch(getTemplatesByNameAndTags(name, tags));
    }
  };
};

const mapStateToProps = (state: RootState) => {
  return {
    templates: state.allTemplates,
    toggleState: state.allCardsViewToggle,
    search: state.search
  };
};
interface Props {
  onClick: (templateID: string) => void;
  getTemplates: () => void;
  getSelectedTemplates: (name?: string, tags?: string[]) => void;
  templates: AllTemplateState;
  toggleState: ViewToggleState;
  search: SearchState;
  selectedTags: string[];
}

export class TemplatesView extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
 
  componentDidMount() {
    // this.props.getTemplates();
    this.props.getSelectedTemplates(undefined, this.props.selectedTags);
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.selectedTags.length != this.props.selectedTags.length) {
      console.log("updated");
      // this.props.getTemplates();
      this.props.getSelectedTemplates(undefined, this.props.selectedTags);
    }
  }

  displayTemplates = (onClick: (templateID: string) => void, templates: Template[], viewType: ViewType) => {
    return viewType === ViewType.List ? (
      <TemplateList templates={templates} displayComponents={{ author: true, dateModified: true, templateName: true, status: true, version: false }} onClick={onClick} />
    ) : (
      <Gallery onClick={onClick} templates={templates} />
    );
  };
  onLoad = (isFetching: boolean, templates: Template[], placeHolder: string) => {
    return isFetching ? (
      <CenteredSpinner size={SpinnerSize.large} />
    ) : templates.length ? (
      this.displayTemplates(this.props.onClick, templates, this.props.toggleState.viewType)
    ) : (
      <PlaceholderText>{placeHolder}</PlaceholderText>
    );
  };
  render() {
    let templatesState: AllTemplateState = this.props.templates;
    let searchState: SearchState = this.props.search;
    let templates: Template[] = [];
    console.log(this.props.selectedTags);
    if (!templatesState.isFetching && templatesState.templates && templatesState.templates.templates) {
      templates = templatesState.templates.templates;
    }
    // if (!searchState.loading && searchState.templates && searchState.templates.templates) {
    //     templates = searchState.templates.templates;
    //   }
    return (
      <React.Fragment>
        {this.onLoad(templatesState.isFetching, templates, ALL_CARDS_PLACEHOLDER)}
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesView);
