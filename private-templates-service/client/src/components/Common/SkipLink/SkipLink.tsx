import React, { Component } from 'react'
import { RootState } from '../../../store/rootReducer';
import { connect } from 'react-redux';
import { SkipLinkContainer } from './styled';
import { SKIP_TO_MAIN_CONTENT_MESSAGE } from "../../../assets/strings"

interface SkipLinkProps {
    contentID?: string;
}

const mapStateToProps = (state: RootState) => {
    return {
        contentID: state.skipLink.contentID
    }
}

class SkipLink extends Component<SkipLinkProps> {
    render() {
        return (
            <SkipLinkContainer href={`#${this.props.contentID}`}>{SKIP_TO_MAIN_CONTENT_MESSAGE}</SkipLinkContainer>
        )
    }
}

export default connect(mapStateToProps)(SkipLink);
