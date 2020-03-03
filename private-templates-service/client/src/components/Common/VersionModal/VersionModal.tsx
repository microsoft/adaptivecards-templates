import React from 'react';
import { connect } from 'react-redux';

// Libraries
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import { Template, PostedTemplate, TemplateInstance } from 'adaptive-templating-service-typescript-node';

// Redux
import { updateTemplate, deleteTemplateVersion } from '../../../store/currentTemplate/actions';

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
  CardBody,
  VersionWrapper,
  DateWrapper,
  StatusWrapper,
  CheckboxWrapper
} from './styled';

import {
  VersionCardRow,
} from '../../Dashboard/PreviewModal/TemplateInfo/VersionCard/styled';

import {
  StatusIndicator,
  Status
} from '../../Dashboard/PreviewModal/TemplateInfo/styled';

import { getDateString } from '../../../utils/versionUtils';

interface Props {
  template: Template;
  toggleModal: () => void;
  updateTemplateState: (templateJSON: string, state: PostedTemplate.StateEnum, version: string) => void;
  deleteTemplateVersion: (version: string) => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateTemplateState: (templateJSON: string, state: PostedTemplate.StateEnum, version: string) => {
      dispatch(updateTemplate(undefined, templateJSON, undefined, undefined, state, undefined, version));
    },
    deleteTemplateVersion: (version: string) => {
      dispatch(deleteTemplateVersion(version, undefined))
    }
  }
}

interface State {
  versionList: string[];
}

class VersionModal extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = { versionList: [] }
  }
  
  delete = () => {
    for (let instance of this.props.template.instances!) {
      if (!instance.version || !this.state.versionList.includes(instance.version!)) continue;
      this.props.deleteTemplateVersion(instance.version!);
      this.props.toggleModal();
    }
  }

  publish = () => {
    for (let instance of this.props.template.instances!){
      if (!this.state.versionList.includes(instance.version!)) continue;
      const template = JSON.stringify(instance.json);
      this.props.updateTemplateState(template, PostedTemplate.StateEnum.Live, instance.version!);
      this.props.toggleModal();
    }
  }

  unpublish = () => {
    for (let instance of this.props.template.instances!){
      if (!this.state.versionList.includes(instance.version!)) continue;
      const template = JSON.stringify(instance.json);
      this.props.updateTemplateState(template, PostedTemplate.StateEnum.Deprecated, instance.version!);
      this.props.toggleModal();
    }
  }

  addVersion = (isChecked?: boolean, version?: string) => {
    if (!isChecked || !version) return;
    let versionList = this.state.versionList;
    if (isChecked === true) {
      if (versionList.includes(version)) return;
      versionList.push(version);
    } else {
      if (!version.includes(version)) return;
      let index = versionList.indexOf(version);
      versionList.splice(index, 1);
    }
    this.setState({ versionList: versionList });
  }

  render() {
    const { template } = this.props;
    return (
      <BackDrop>
        <Modal>
          <Header>Versions</Header>
          <Description>There are {template.instances!.length} versions for <DescriptionAccent>{template.name}</DescriptionAccent></Description>
          <CenterPanelWrapper>
            <Card>
              <CardHeaderRow>
                <CardHeaderText>Version</CardHeaderText>
                <CardHeaderText>Published</CardHeaderText>
                <CardHeaderText>Status</CardHeaderText>
                <CardHeaderText>{`${this.state.versionList!.length} Selected`}</CardHeaderText>
              </CardHeaderRow>
              <CardBody>
              {this.props.template.instances && this.props.template.instances.map((instance: TemplateInstance) => (
            <VersionCardRow>
              <VersionWrapper>
                {instance.version}
              </VersionWrapper>      
              <DateWrapper>{instance.publishedAt? getDateString(instance.publishedAt) : "Not published"}</DateWrapper>
              <StatusWrapper>
                <StatusIndicator state={instance.state}/>
                <Status>{instance.state && instance.state.toString().charAt(0).toUpperCase() + instance.state.toString().slice(1)}</Status>
              </StatusWrapper>
              <CheckboxWrapper><Checkbox defaultChecked={false} onChange={(e, checked) => this.addVersion(checked, instance.version)}/></CheckboxWrapper>
            </VersionCardRow>
            ))}     
              </CardBody>
            </Card>
          </CenterPanelWrapper>
          <BottomRow>
            <ButtonGroup>
              <LightButton text="Cancel" onClick={this.props.toggleModal} />
              <LightButton text="Delete" onClick={this.delete} />
              <PrimaryStyleButton text="Unpublish" onClick={this.unpublish} />
              <PrimaryStyleButton text="Publish" onClick={this.publish} />
            </ButtonGroup>
          </BottomRow>
        </Modal>
      </BackDrop>
    );
  }
}

export default connect(() => { return {} }, mapDispatchToProps)(VersionModal);
