import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AdaptiveCard from '../Common/AdaptiveCard';
import NavBar from '../NavBar/NavBar';
import TemplateSourceInfo from './TemplateSourceInfo';
import requireAuthentication from '../../utils/requireAuthentication';

import { connect } from "react-redux";
import { setPage } from '../../store/page/actions';
import { RootState } from '../../store/rootReducer';
import { setSearchBarVisible } from '../../store/search/actions';
import { getTemplate } from '../../store/currentTemplate/actions';

import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper } from './styled';

import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';
import requireShared from '../../utils/requireShared/requireShared';

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
    setSearchBarVisible: (isSearchBarVisible: boolean) => {
      dispatch(setSearchBarVisible(isSearchBarVisible));
    },
    getTemplate: (templateID: string) => {
      dispatch(getTemplate(templateID));
    }
  };
};

interface SharedComponentProps {
  currentPageTitle?: string;
  template?: Template;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  getTemplate: (templateID: string) => void;
}

const Shared = (props: SharedComponentProps) => {

  const { uuid, version } = useParams();
  let templateInstance: TemplateInstance | undefined = undefined;


  useEffect(() => {
    props.setPage((props.template !== undefined && props.template.name &&
      props.template.name !== "") ? props.template.name : "Preview", "sharedPage");

    console.log(uuid);
    if (uuid) {
      props.getTemplate(uuid);
    }
  }, []);

  useEffect(() => {
    if (uuid !== undefined) {
      console.log(uuid);
      props.getTemplate(uuid);
    }
  }, [uuid]);

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
  if (templateInstance && templateInstance.isShareable) {
    return (
      <React.Fragment>
        <NavBar></NavBar>
        <ModalBackdrop>
          <ModalWrapper>
            <ACPanel>
              <ACWrapper>
                <AdaptiveCard cardtemplate={props.template ? props.template : new Template()} templateVersion={version ? version : ""}></AdaptiveCard>
              </ACWrapper>
            </ACPanel>
            <DescriptorWrapper>
              <TemplateSourceInfo templateJSON={templateInstance !== undefined ? templateInstance['json'] : ''}>
              </TemplateSourceInfo>
            </DescriptorWrapper>
          </ModalWrapper>
        </ModalBackdrop>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment>
        This card is not shared.
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Shared));
