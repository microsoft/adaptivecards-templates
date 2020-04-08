// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { SpinnerSize } from "office-ui-fabric-react";
import { RootState } from "../../../store/rootReducer";
import { AllTemplateState } from "../../../store/templates/types";
import { ViewToggleState, ViewType } from "../../../store/viewToggle/types";
import { getAllTemplates, getTemplatesByTags } from "../../../store/templates/actions";
// Components
import { CenteredSpinner, PlaceholderText } from "../../Dashboard/styled";
import { Template } from "adaptive-templating-service-typescript-node";
import Gallery from "../../Gallery";
import TemplateList from "../../Dashboard/TemplateList";
// Strings
import { ALL_CARDS_PLACEHOLDER } from "../../../assets/strings";

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTemplates: () => {
      dispatch(getAllTemplates());
    },
    getSelectedTemplates: (tags?: string[]) => {
      dispatch(getTemplatesByTags(tags));
    }
  };
};

const mapStateToProps = (state: RootState) => {
  return {
    templates: state.allTemplates,
    toggleState: state.allCardsViewToggle
  };
};
interface Props {
  onClick: (templateID: string) => void;
  getTemplates: () => void;
  getSelectedTemplates: (tags?: string[]) => void;
  templates: AllTemplateState;
  toggleState: ViewToggleState;
  selectedTags: string[];
}

export class TemplatesView extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
 
  componentDidMount() {
    this.props.getSelectedTemplates(this.props.selectedTags);
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.selectedTags.length != this.props.selectedTags.length) {
      this.props.getSelectedTemplates(this.props.selectedTags);
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
      <React.Fragment>
        {templatesState.isFetching ? (
          <CenteredSpinner size={SpinnerSize.large} />
        ) : templates.length ? (
          toggleState.viewType === ViewType.List ? (
            <TemplateList templates={templates} displayComponents={{ author: true, dateModified: true, templateName: true, status: true, version: false }} onClick={onClick} />
          ) : (
            <Gallery onClick={onClick} templates={templates} />
          )
        ) : (
          <PlaceholderText>{ALL_CARDS_PLACEHOLDER}</PlaceholderText>
        )}
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesView);