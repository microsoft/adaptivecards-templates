import React from 'react';
import { connect } from 'react-redux';

import {
  Template,
  TemplateInstance
} from 'adaptive-templating-service-typescript-node';

import {
  CardManageButton,
  CardTitle,
  VersionCardHeader,
  VersionCardRowTitle,
  DateWrapper,
  VersionCardRow,
  StatusWrapper,
  VersionIcon,
  VersionWrapper,
  InfoVersionContainer,
  VersionOuterCard,
  VersionCardBody
} from './styled'

import {
  CardHeader,
  StatusIndicator,
  Status
} from './../styled';

import * as STRINGS from '../../../../../assets/strings';

import { getDateString } from '../../../../../utils/versionUtils';
import { capitalizeString } from "../../../../../utils/stringUtils";
import { ModalState } from '../../../../../store/page/types';
import { openModal } from '../../../../../store/page/actions';
import { updateCurrentTemplateVersion } from '../../../../../store/currentTemplate/actions';
import VersionModal from '../../../../Common/VersionModal';
import { MANAGE } from '../../../../../assets/strings';
import { RootState } from '../../../../../store/rootReducer';
import { Scroller } from "../../../../../utils/Scroller";

interface Props {
  template: Template;
  templateVersion: string;
  modalState?: ModalState;
  openModal: (modalState: ModalState) => void;
  updateCurrentTemplateVersion: (template: Template, version: string) => void;
  onSwitchVersion: (templateVersion: string) => void;
}

const mapStateToProps = (state: RootState) => {
  return {
    modalState: state.page.modalState,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    openModal: (modalState: ModalState) => {
      dispatch(openModal(modalState));
    },
    updateCurrentTemplateVersion: (template: Template, version: string) => {
      dispatch(updateCurrentTemplateVersion(template, version))
    }
  }
};

class VersionCard extends React.Component<Props> {
  scroller: Scroller;
  constructor(props: Props) {
    super(props);
    this.scroller = new Scroller();
  }

  onVersionChange = (event: any, version: string) => {
    this.props.updateCurrentTemplateVersion(this.props.template, version);
    this.props.onSwitchVersion(version);
  };

  render() {
    return (
      <VersionOuterCard key="Recent Releases" style={{ flex: '1 0 auto' }}>
        <CardHeader>
          <VersionCardHeader>
            <CardTitle>Recent Releases</CardTitle>
            <CardManageButton onClick={() => { this.props.openModal(ModalState.Version) }} tabIndex={this.props.modalState ? -1 : 0}>
              {MANAGE}
            </CardManageButton>
          </VersionCardHeader>
        </CardHeader>
        <VersionCardBody>
          <VersionCardRow>
            <VersionCardRowTitle style={{ flexBasis: `15%` }}>{STRINGS.VERSION}</VersionCardRowTitle>
            <VersionCardRowTitle style={{ flexBasis: `25%` }}>{STRINGS.UPDATED}</VersionCardRowTitle>
            <VersionCardRowTitle style={{ flexBasis: `20%` }}>{STRINGS.STATUS}</VersionCardRowTitle>
          </VersionCardRow>
          <InfoVersionContainer onWheel={this.scroller.verticalScroll}>
            {this.props.template.instances && this.props.template.instances.map((instance: TemplateInstance, index: number) => (
              <VersionCardRow key={index} onClick={(event: any) => { this.onVersionChange(event, instance.version!) }}>
                <VersionWrapper>
                  {instance.version}
                  {instance.version === this.props.templateVersion && <VersionIcon iconName={'View'} />}
                </VersionWrapper>
                <DateWrapper>{instance.updatedAt ? getDateString(instance.updatedAt) : "N/A"}</DateWrapper>
                <StatusWrapper>
                  <StatusIndicator state={instance.state} />
                  <Status>{instance.state && capitalizeString(instance.state.toString())}</Status>
                </StatusWrapper>
              </VersionCardRow>
            ))}
          </InfoVersionContainer>
        </VersionCardBody>
        {this.props.modalState === ModalState.Version && <VersionModal template={this.props.template} />}
      </VersionOuterCard>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VersionCard);

