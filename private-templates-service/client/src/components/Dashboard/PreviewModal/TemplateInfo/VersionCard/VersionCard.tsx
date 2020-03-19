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
  VersionWrapper
} from './styled'

import {
  Card,
  CardHeader,
  CardBody,
  StatusIndicator,
  Status
} from './../styled';

import { getDateString } from '../../../../../utils/versionUtils';
import { ModalState } from '../../../../../store/page/types';
import { openModal } from '../../../../../store/page/actions';
import VersionModal from '../../../../Common/VersionModal';
import { MANAGE } from '../../../../../assets/strings';
import { RootState } from '../../../../../store/rootReducer';

interface Props {
  template: Template;
  templateVersion: string;
  modalState?: ModalState;
  openModal: (modalState: ModalState) => void;
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
    }
  }
};

class VersionCard extends React.Component<Props> {
  render() {
    return (
      <Card key="Recent Releases" style={{ flex: '1 0 auto' }}>
        <CardHeader>
          <VersionCardHeader>
            <CardTitle>Recent Releases</CardTitle>
            <CardManageButton onClick={() => { this.props.openModal(ModalState.Version) }}>{MANAGE}</CardManageButton>
          </VersionCardHeader>
        </CardHeader>
        <CardBody>
          <VersionCardRow>
            <VersionCardRowTitle style={{ flexBasis: `15%` }}>Version</VersionCardRowTitle>
            <VersionCardRowTitle style={{ flexBasis: `25%` }}>Updated</VersionCardRowTitle>
            <VersionCardRowTitle style={{ flexBasis: `20%` }}>Status</VersionCardRowTitle>
          </VersionCardRow>
          {this.props.template.instances && this.props.template.instances.map((instance: TemplateInstance, index: number) => (
            <VersionCardRow key={index}>
              <VersionWrapper>
                {instance.version}
                {instance.version === this.props.templateVersion && <VersionIcon iconName={'View'} />}
              </VersionWrapper>
              <DateWrapper>{instance.updatedAt ? getDateString(instance.updatedAt) : "N/A"}</DateWrapper>
              <StatusWrapper>
                <StatusIndicator state={instance.state} />
                <Status>{instance.state && instance.state.toString().charAt(0).toUpperCase() + instance.state.toString().slice(1)}</Status>
              </StatusWrapper>
            </VersionCardRow>
          ))}
        </CardBody>
        {this.props.modalState === ModalState.Version && <VersionModal template={this.props.template} />}
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VersionCard);

