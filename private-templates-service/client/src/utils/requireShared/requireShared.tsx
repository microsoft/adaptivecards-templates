import React from 'react';
import { Template } from 'adaptive-templating-service-typescript-node';
import { RootState } from '../../store/rootReducer';
import { connect } from 'react-redux';
import { getTemplate } from '../../store/currentTemplate/actions';
import { useParams } from 'react-router-dom';

interface RequireSharedProps {
  template?: Template;
  templateVersion: string;
  getTemplate: (templateID: string) => void;
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

  return (props: P & RequireSharedProps) => {
    const isShared = () => {
      if (props.template && props.template.instances) {
        for (let i = 0; i < props.template.instances.length; i++) {
          if (props.template.instances[i].version === props.templateVersion) {
            return props.template.instances[i].isShareable;
          }
        }
      }
      return false;
    }

    if (!props.template) {
      const { uuid, version } = useParams();
      props.getTemplate(uuid ? uuid : "");
    }

    return <React.Fragment>
      {isShared() ?
        <Component {...props} /> :
        <React.Fragment>Not shared yet.</React.Fragment>}
    </React.Fragment>
  }

  // return class SharedComponent extends React.Component<P & RequireSharedProps> {

  //   isShared = () => {
  //     if (this.props.template && this.props.template.instances) {
  //       for (let i = 0; i < this.props.template.instances.length; i++) {
  //         if (this.props.template.instances[i].version === this.props.templateVersion) {
  //           return this.props.template.instances[i].isShareable;
  //         }
  //       }
  //     }
  //     return false;
  //   }

  //   render() {
  //     if (!this.props.template) {
  //       const { uuid, version } = useParams();
  //       this.props.getTemplate(uuid ? uuid : "");
  //     }
  //     return (
  //       <React.Fragment>
  //         {this.isShared() ?
  //           <Component {...this.props} /> :
  //           <React.Fragment>Not shared yet.</React.Fragment>}
  //       </React.Fragment>
  //     );
  //   }
  // }
}

export default (c: any) => connect(mapStateToProps)(requireShared(c));