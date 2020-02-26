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

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle,
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    },
    setSearchBarVisible: (isSearchBarVisible: boolean) => {
      dispatch(setSearchBarVisible(isSearchBarVisible));
    }
  };
};

interface SharedComponentProps {
  currentPageTitle: string;
  templateID: string;
  templateJSON: string;
  templateName: string;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
}

const Shared = (props: SharedComponentProps) => {

  let { uuid } = useParams();

  useEffect(() => {
    props.setPage(props.templateName, "sharedPage");
    props.setSearchBarVisible(false);
  });

  return (
    <React.Fragment>
      <NavBar></NavBar>
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <TemplateSourceInfo>
            </TemplateSourceInfo>
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Shared));