import React, { useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import { setPage } from '../../store/page/actions';
import { connect } from "react-redux";
import { RootState } from '../../store/rootReducer';
import requireAuthentication from '../../utils/requireAuthentication';
import { setSearchBarVisible } from '../../store/search/actions';
import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper } from './styled';
import { DescriptorWrapper } from '../Dashboard/PreviewModal/styled';
import TemplateSourceInfo from './TemplateSourceInfo';
import AdaptiveCard from '../Common/AdaptiveCard';
import { useParams } from 'react-router-dom';
import { getTemplate, getTemplateInstance } from '../../store/currentTemplate/actions';
import { Template, TemplateInstance } from 'adaptive-templating-service-typescript-node';

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle,
    template: state.currentTemplate.template,
    templateInstance: state.currentTemplate.templateInstance
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
    },
    assignTemplateInstance: (version?: string) => {
      dispatch(getTemplateInstance(version));
    }
  };
};

interface SharedComponentProps {
  currentPageTitle: string;
  template: Template;
  templateInstance?: TemplateInstance;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  getTemplate: (templateID: string) => void;
  assignTemplateInstance: (version?: string) => void;
}

const Shared = (props: SharedComponentProps) => {

  let { uuid, version } = useParams();
  //let templateInstance: TemplateInstance | undefined = undefined;
  props.setPage((props.template !== undefined && props.template.name &&
    props.template.name !== "") ? props.template.name : "Preview", "sharedPage");
  props.setSearchBarVisible(false);

  useEffect(() => {
    if (uuid !== undefined) {
      props.getTemplate(uuid);
    }
  }, [uuid]);

  useEffect(() => {
    if (props.template !== undefined && props.template.instances !== undefined &&
      props.template.instances !== null && props.template.instances.length > 0) {
      props.assignTemplateInstance(version);
    }

  }, [props.template]);

  return (
    <React.Fragment>
      <NavBar></NavBar>
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
              <AdaptiveCard cardtemplate={props.template}></AdaptiveCard>
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <TemplateSourceInfo templateJSON={props.templateInstance !== undefined ? props.templateInstance['json'] : ''}>
            </TemplateSourceInfo>
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Shared));