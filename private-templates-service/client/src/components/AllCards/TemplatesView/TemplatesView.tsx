// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { SpinnerSize } from "office-ui-fabric-react";
import { RootState } from "../../../store/rootReducer";
import { AllTemplateState } from "../../../store/templates/types";
import { ViewToggleState, ViewType } from "../../../store/viewToggle/types";
import { getAllTemplates } from "../../../store/templates/actions";
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
  };
};

const mapStateToProps = (state: RootState) => {
  return {
    templates: state.allTemplates,
    toggleState: state.allCardsViewToggle,
  };
};
interface TemplatesViewProps {
  templates: AllTemplateState;
  getTemplates: () => void;
  toggleState: ViewToggleState;
  onClick: (templateID: string) => void;
}

export class TemplatesView extends Component<TemplatesViewProps> {
  constructor(props: TemplatesViewProps) {
    super(props);
    this.props.getTemplates();
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
