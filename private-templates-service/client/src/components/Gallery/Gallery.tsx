import * as React from "react";
import { connect } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import AdaptiveCardPanel from "../AdaptiveCardPanel";
import { Container } from "./styled";
import { getTemplates } from "../../store/templates/actions";

const mapStateToProps = (state: RootState) => {
  return { state: state };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTemplates: () => { dispatch(getTemplates()) }
  }
}

interface Props {
  toggleModal: () => void;
  getTemplates: () => void;
  state: RootState;
}

class Gallery extends React.Component<Props> {
  componentDidMount() {
    this.props.getTemplates();
  }
  render() {
    let cards = [];
    if (!this.props.state.templates.fetching && this.props.state && this.props.state.templates && this.props.state.templates.templates && this.props.state.templates.templates.templates) {
      cards = this.props.state.templates.templates.templates.map((val: any) => <AdaptiveCardPanel toggleModal={this.props.toggleModal} template={val} />);
    }
    return (
      <Container>
        {cards}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);