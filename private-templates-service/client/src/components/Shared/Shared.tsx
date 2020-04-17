import React, { useEffect } from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import AdaptiveCard from '../Common/AdaptiveCard';
import NavBar from '../NavBar/NavBar';
import TemplateSourceInfo from './TemplateSourceInfo';
import requireAuthentication from '../../utils/requireAuthentication';
import requireShared from '../../utils/requireShared/requireShared';

import { connect } from "react-redux";
import { setPage } from '../../store/page/actions';
import { RootState } from '../../store/rootReducer';
import { getTemplate } from '../../store/currentTemplate/actions';

import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper, CenteredSpinner } from './styled';

import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';
import { CHECK_URL, SHARED_PREVIEW } from '../../assets/strings';

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle,
    template: state.currentTemplate.template
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    },
    getTemplate: (templateID: string) => {
      dispatch(getTemplate(templateID));
    }
  };
};

interface MatchParams {
  uuid: string;
  version: string;
}

interface SharedComponentProps extends RouteComponentProps<MatchParams> {
  authButtonMethod: () => Promise<void>;
  currentPageTitle?: string;
  template?: Template;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  getTemplate: (templateID: string) => void;
}

const Shared = (props: SharedComponentProps) => {
  let templateInstance: TemplateInstance | undefined = undefined;
  let uuid = props.match.params.uuid;
  let version = props.match.params.version;

  const {
    template,
    setPage,
  } = props;

  useEffect(() => {
    if (template !== undefined) {
      setPage(template.name || SHARED_PREVIEW, "sharedPage");
    }
  }, [template, setPage])

  if (uuid) {
    props.getTemplate(uuid);
  } else {
    return <React.Fragment>{CHECK_URL}</React.Fragment>;
  }

  if (props.template !== undefined && props.template.instances && props.template.instances.length > 0) {
    if (version) {
      for (let i = 0; i < props.template.instances.length; i++) {
        if (props.template.instances[i].version === version) {
          templateInstance = props.template.instances[i];
          break;
        }
      }
    }
    else {
      templateInstance = props.template.instances[props.template.instances.length - 1];
    }
  }

  return props.template ? (
    <React.Fragment>
      <NavBar />
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
              <AdaptiveCard cardtemplate={props.template} templateVersion={version ? version : ""} />
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <TemplateSourceInfo templateJSON={templateInstance !== undefined ? templateInstance['json'] : {}}>
            </TemplateSourceInfo>
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    </React.Fragment>
  ) : (
      <ModalBackdrop>
        <CenteredSpinner size={SpinnerSize.large} />
      </ModalBackdrop>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(requireShared(withRouter(Shared))));
