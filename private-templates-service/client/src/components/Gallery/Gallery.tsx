import * as React from "react";
import { connect } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import AdaptiveCardPanel from "../AdaptiveCardPanel";
import { Container } from "./styled";
import { getAllTemplates } from "../../store/templates/actions";
import { AllTemplateState } from "../../store/templates/types";

const mapStateToProps = (state: RootState) => {
  return { templates: state.templates };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTemplates: () => { dispatch(getAllTemplates()) }
  }
}

interface Props {
  toggleModal: () => void;
  getTemplates: () => void;
  templates: AllTemplateState;
}

class Gallery extends React.Component<Props> {
  componentDidMount() {
    this.props.getTemplates();
  }
  render() {
    let cards: JSX.Element[] = [];
    if (!this.props.templates.fetching && this.props && this.props.templates && this.props.templates.templates && this.props.templates.templates.templates) {
      cards = this.props.templates.templates.templates.map((val: any) => <AdaptiveCardPanel toggleModal={this.props.toggleModal} template={val} />);
    }
    return (
      <Container>
        {cards}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
