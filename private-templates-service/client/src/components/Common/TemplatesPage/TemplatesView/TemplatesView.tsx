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

  componentDidMount() {
    this.props.getTemplates(this.props.selectedTags);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedTags.length !== this.props.selectedTags.length) {
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

export default connect(mapStateToProps)(TemplatesView);
