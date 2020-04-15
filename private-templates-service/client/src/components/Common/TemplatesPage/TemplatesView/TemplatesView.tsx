// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { SpinnerSize } from "office-ui-fabric-react";
import { RootState } from "../../../../store/rootReducer";
import { AllTemplateState } from "../../../../store/templates/types";
import { ViewToggleState, ViewType } from "../../../../store/viewToggle/types";
// Components
import { CenteredSpinner, PlaceholderText } from "../../../Dashboard/styled";
import { Template } from "adaptive-templating-service-typescript-node";
import Gallery from "../../../Gallery";
import TemplateList from "../../../Dashboard/TemplateList";
// Strings
import { ALL_CARDS_PLACEHOLDER, ALL_CARDS } from "../../../../assets/strings";

const mapStateToProps = (state: RootState) => {
  return {
    templates: state.allTemplates,
    toggleState: state.allCardsViewToggle
  };
};
interface Props {
  onClick: (templateID: string) => void;
  getTemplates: (tags?: string[]) => void;
  templates: AllTemplateState;
  toggleState: ViewToggleState;
  selectedTags: string[];
}

export class TemplatesView extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTemplates(this.props.selectedTags);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedTags.length != this.props.selectedTags.length) {
      this.props.getTemplates(this.props.selectedTags);
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
        ) : templates.length ? (
          toggleState.viewType === ViewType.List ? (
            <TemplateList templates={templates} displayComponents={{ author: true, dateModified: true, templateName: true, status: true, version: false }} onClick={onClick} />
          ) : (
              <Gallery onClick={onClick} templates={templates} />
            )
        ) : (
              <PlaceholderText>{ALL_CARDS_PLACEHOLDER}</PlaceholderText>
            )}
      </section>
    );
  }
}

export default connect(mapStateToProps)(TemplatesView);