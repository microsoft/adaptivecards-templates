import React from 'react';
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

const mapStateToProps = (state: RootState) => {
  return {
    currentPageTitle: state.page.currentPageTitle
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string) => {
      dispatch(setPage(currentPageTitle));
    },
    setSearchBarVisible: (isSearchBarVisible: boolean) => {
      dispatch(setSearchBarVisible(isSearchBarVisible));
    }
  };
};

interface SharedComponentProps {
  currentPageTitle: string;
  authButtonMethod: () => Promise<void>;
  setPage: (currentPageTitle: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
}

class Shared extends React.Component<SharedComponentProps> {

  componentWillMount() {
    this.props.setPage("Preview");
    this.props.setSearchBarVisible(false);
  }

  render() {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(Shared));