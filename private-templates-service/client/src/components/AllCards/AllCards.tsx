// React
import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
// Components
import TemplatesPage from '../Common/TemplatesPage';
// Redux Store
import { getAllTags } from '../../store/tags/actions'
import { getAllTemplates } from '../../store/templates/actions'
// Strings
import {ALL_CARDS, ALL_CARDS_TITLE} from '../../assets/strings'
// Utils
import requireAuthentication from '../../utils/requireAuthentication';
const mapDispatchToProps = (dispatch: any) => {
    return {
      getTemplates: (tags?: string[]) => {
        dispatch(getAllTemplates(tags));
      },
      getTags: () => {
        dispatch(getAllTags());
      }
    };
};

interface Props extends RouteComponentProps {
    getTemplates: (tags?: string[]) => void;
    getTags: () => void;
}
export class AllCards extends Component<Props> {
    render() {
        return (
            <TemplatesPage getTags={this.props.getTags} getTemplates={this.props.getTemplates} pageTitle={ALL_CARDS_TITLE} pageID={ALL_CARDS}/>
        )
    }
}
export default connect(null, mapDispatchToProps)(requireAuthentication(withRouter(AllCards)));
