import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../store/rootReducer';
import { connect } from 'react-redux';
import { getTemplate } from '../../store/currentTemplate/actions';

import { Template } from 'adaptive-templating-service-typescript-node';
import { PERMISSION_DENIED } from '../../assets/strings';

interface MatchParams {
  uuid: string;
  version: string;
}
interface RequireSharedProps extends RouteComponentProps<MatchParams> {
  template?: Template;
  getTemplate: (templateID: string) => void;
  authButtonMethod: () => Promise<void>;
}

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTemplate: (templateID: string) => {
      dispatch(getTemplate(templateID));
    }
  };
};

const requireShared = <P extends object>(Component: React.ComponentType<P>) => {
  return class SharedComponent extends React.Component<P & RequireSharedProps> {

    constructor(props: P & RequireSharedProps) {
      super(props);
      if (!this.props.template) {
        const uuid = this.props.match.params.uuid;
        this.props.getTemplate(uuid ? uuid : "");
      }
    }

    isShared = () => {
      if (this.props.template && this.props.template.instances) {
        for (let i = 0; i < this.props.template.instances.length; i++) {
          if (this.props.template.instances[i].version === this.props.match.params.version) {
            return this.props.template.instances[i].isShareable;
          }
        }
      }
      return false;
    }

    render() {
      return (
        <React.Fragment>
          {this.isShared() ?
            <Component {...this.props} /> :
            <React.Fragment>{PERMISSION_DENIED}</React.Fragment>}
        </React.Fragment>
      );
    }
  }
}

export default (c: any) => connect(mapStateToProps, mapDispatchToProps)(withRouter(requireShared(c)));
