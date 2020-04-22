import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import { Template, PostedTemplate, TemplateInstance } from 'adaptive-templating-service-typescript-node';

// Redux
import { batchUpdateTemplateState, batchDeleteTemplateVersions } from '../../../store/currentTemplate/actions';

// Styles
import {
  BackDrop,
  Modal,
  Header,
  Description,
  DescriptionAccent,
  CenterPanelWrapper,
  BottomRow,
  ButtonGroup,
  LightButton,
  PrimaryStyleButton,
  Card,
  CardHeaderRow,
  CardHeaderText,
  SelectedHeaderText,
  CardBody,
  VersionWrapper,
  DateWrapper,
  StatusWrapper,
  CheckboxWrapper,
  VersionContainer
} from './styled';
import * as STRINGS from '../../../assets/strings';
import {
  VersionCardRow,
} from '../../Dashboard/PreviewModal/TemplateInfo/VersionCard/styled';

import {
  StatusIndicator,
  Status
} from '../../Dashboard/PreviewModal/TemplateInfo/styled';

import { getDateString } from '../../../utils/versionUtils';
import { capitalizeString, getState } from "../../../utils/stringUtils";
import ModalHOC from '../../../utils/ModalHOC';
import { closeModal } from '../../../store/page/actions';
import { THERE_ARE, VERSIONS_FOR, VERSION_HEADER, PUBLISHED_HEADER, STATUS_HEADER, NOT_PUBLISHED, SELECTED, VERSION_CANCEL, VERSION_DELETE, VERSION_UNPUBLISH, VERSION_PUBLISH } from '../../../assets/strings';

interface Props {
  template: Template;
  closeModal: () => void;
  updateTemplateState: (versionList: string[], stateList: PostedTemplate.StateEnum[]) => void;
  deleteTemplateVersions: (versionList: string[]) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
    updateTemplateState: (versionList: string[], stateList: PostedTemplate.StateEnum[]) => {
      dispatch(batchUpdateTemplateState(versionList, stateList, undefined));
    },
    deleteTemplateVersions: (versionList: string[]) => {
      dispatch(batchDeleteTemplateVersions(versionList, undefined))
    }
  }
}

interface State {
  versionList: boolean[];
}

class VersionModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { versionList: this.props.template.instances ? new Array(this.props.template.instances.length) : [] }
  }

  containsState = (state: PostedTemplate.StateEnum): boolean => {
    let instances = this.props.template.instances || [];
    for (let i = 0; i < this.state.versionList.length; i++) {
      if (instances[i].state === state && this.state.versionList[i]) {
        return true;
      }
    }
    return false;
  }

  delete = () => {
    let list = this.props.template.instances!;
    let versionList: string[] = [];
    for (let i = 0; i < list.length; i++) {
      if (!this.state.versionList[i]) continue;
      versionList.push(list[i].version!);
    }
    this.props.deleteTemplateVersions(versionList);
    this.props.closeModal();
  }

  publish = () => {
    let list = this.props.template.instances!;
    let versionList: string[] = [];
    let stateList: PostedTemplate.StateEnum[] = [];
    for (let i = 0; i < list.length; i++) {
      if (!this.state.versionList[i]) continue;
      versionList.push(list[i].version!);
      stateList.push(PostedTemplate.StateEnum.Live);
    }
    this.props.updateTemplateState(versionList, stateList);
    this.props.closeModal();
  }

  unpublish = () => {
    let list = this.props.template.instances!;
    let versionList: string[] = [];
    let stateList: PostedTemplate.StateEnum[] = [];
    for (let i = 0; i < list.length; i++) {
      if (!this.state.versionList[i]) continue;
      versionList.push(list[i].version!);
      stateList.push(PostedTemplate.StateEnum.Deprecated);
    }
    this.props.updateTemplateState(versionList, stateList);
    this.props.closeModal();
  }

  render() {
    const { template } = this.props;
    return (
      <BackDrop>
        <Modal aria-label={STRINGS.VERSIONS}>
          <Header>{STRINGS.VERSIONS}</Header>
          <Description>{THERE_ARE} {template.instances!.length} {VERSIONS_FOR} <DescriptionAccent>{template.name}</DescriptionAccent></Description>
          <CenterPanelWrapper>
            <Card>
              <CardHeaderRow>
                <CardHeaderText>{VERSION_HEADER}</CardHeaderText>
                <CardHeaderText>{PUBLISHED_HEADER}</CardHeaderText>
                <CardHeaderText>{STATUS_HEADER}</CardHeaderText>
                <SelectedHeaderText>{`${this.state.versionList.filter(function (s) { return s; }).length} ${SELECTED}`}</SelectedHeaderText>
              </CardHeaderRow>
              <CardBody>
                <VersionContainer>
                  {this.props.template.instances && this.props.template.instances.map((instance: TemplateInstance, index: number) => (
                    <VersionCardRow>
                      <VersionWrapper>
                        {instance.version}
                      </VersionWrapper>
                      <DateWrapper>{instance.publishedAt ? getDateString(instance.publishedAt) : `${NOT_PUBLISHED}`}</DateWrapper>
                      <StatusWrapper>
                        <StatusIndicator state={instance.state!} />
                        <Status>{getState(instance.state && capitalizeString(instance.state.toString()))}</Status>
                      </StatusWrapper>
                      <CheckboxWrapper><Checkbox checked={this.state.versionList[index]}
                        onChange={() => {
                          let updatedVersion = this.state.versionList;
                          updatedVersion[index] = !updatedVersion[index];
                          this.setState({ versionList: updatedVersion });
                        }} /></CheckboxWrapper>
                    </VersionCardRow>
                  ))}
                </VersionContainer>
              </CardBody>
            </Card>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <LightButton text={VERSION_CANCEL} onClick={this.props.closeModal} />
              <LightButton text={VERSION_DELETE} onClick={this.delete} />
              <PrimaryStyleButton disabled={this.containsState(PostedTemplate.StateEnum.Draft) || this.containsState(PostedTemplate.StateEnum.Deprecated)} text={VERSION_UNPUBLISH} onClick={this.unpublish} />
              <PrimaryStyleButton disabled={this.containsState(PostedTemplate.StateEnum.Live)} text={VERSION_PUBLISH} onClick={this.publish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default ModalHOC(connect(() => { return {} }, mapDispatchToProps)(VersionModal));
