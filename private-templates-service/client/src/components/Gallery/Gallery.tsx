import * as React from "react";
import { connect } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import AdaptiveCardPanel from "../AdaptiveCardPanel";
import { Container } from "./styled";
import { getTemplates } from "../../store/templates/actions";
import { Template } from "adaptive-templating-service-typescript-node";

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
  componentDidUpdate(prevProps: Props) {
    if (!this.props.state.templates.fetching && this.props.state && this.props.state.templates && this.props.state.templates.templates) {
      // this.props.state.templates.templates.templates.map((val: any) => console.log((val.instances[0])));
      // this.props.state.templates.templates.templates.map((val: any) => console.log((val)));

    }

  }

  render() {
    let cards = [];
    if (!this.props.state.templates.fetching && this.props.state && this.props.state.templates && this.props.state.templates.templates && this.props.state.templates.templates.templates) {
      cards = this.props.state.templates.templates.templates.map((val: any) => <AdaptiveCardPanel toggleModal={this.props.toggleModal} template={val} />);
    }

    return (
      <Container>
        {cards}
        {/* {cards.slice(0, 3)} */}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);