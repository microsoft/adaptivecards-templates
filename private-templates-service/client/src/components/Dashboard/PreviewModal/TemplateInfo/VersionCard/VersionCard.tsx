import React from "react";
import { connect } from "react-redux";

import { Template, TemplateInstance } from "adaptive-templating-service-typescript-node";

import {
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
  VersionCardBody,
  VersionCardRowHover,
  VersionElementsContainer,
  StatusElementsContainer,
  StatusIndicatorOverride,
} from "./styled";

import { CardHeader, Status } from "./../styled";

import * as STRINGS from "../../../../../assets/strings";

import { getDateString } from "../../../../../utils/versionUtils";
import { getStateFromInstance } from "../../../../../utils/stringUtils";
import { ModalState } from "../../../../../store/page/types";
import { updateCurrentTemplateVersion } from "../../../../../store/currentTemplate/actions";
import VersionModal from "../../../../Common/VersionModal";
import { NA } from "../../../../../assets/strings";
import { RootState } from "../../../../../store/rootReducer";

interface Props {
  template: Template;
  templateVersion: string;
  modalState?: ModalState;
  updateCurrentTemplateVersion: (template: Template, version: string) => void;
  onSwitchVersion: (templateVersion: string) => void;
}

const mapStateToProps = (state: RootState) => {
  return {
    modalState: state.page.modalState,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateCurrentTemplateVersion: (template: Template, version: string) => {
      dispatch(updateCurrentTemplateVersion(template, version));
    },
  };
};

class VersionCard extends React.Component<Props> {
  onVersionChange = (event: any, version: string) => {
    this.props.updateCurrentTemplateVersion(this.props.template, version);
    this.props.onSwitchVersion(version);
  };

  render() {
    return (
      <VersionOuterCard key={STRINGS.RECENT_RELEASES} style={{ flex: "1 1 auto" }} aria-label={STRINGS.RECENT_RELEASES}>
        <CardHeader>
          <VersionCardHeader>
            <CardTitle>{STRINGS.RECENT_RELEASES}</CardTitle>
          </VersionCardHeader>
        </CardHeader>
        <VersionCardBody>
          <VersionCardRow>
            <VersionCardRowTitle style={{ flexBasis: `15%` }}>{STRINGS.VERSION}</VersionCardRowTitle>
            <VersionCardRowTitle style={{ flexBasis: `25%` }}>{STRINGS.UPDATED}</VersionCardRowTitle>
            <VersionCardRowTitle style={{ flexBasis: `25%` }}>{STRINGS.STATUS}</VersionCardRowTitle>
          </VersionCardRow>
          <InfoVersionContainer>
            {this.props.template.instances &&
              this.props.template.instances.map((instance: TemplateInstance, index: number) => (
                <VersionCardRowHover
                  key={index}
                  onClick={(event: any) => {
                    this.onVersionChange(event, instance.version!);
                  }}
                >
                  <VersionWrapper>
                    <VersionElementsContainer>
                      {instance.version}
                      {instance.version === this.props.templateVersion && <VersionIcon iconName={"View"} />}
                    </VersionElementsContainer>
                  </VersionWrapper>
                  <DateWrapper>{instance.updatedAt ? getDateString(instance.updatedAt) : `${NA}`}</DateWrapper>
                  <StatusWrapper>
                    <StatusElementsContainer>
                      <StatusIndicatorOverride state={instance.state} />
                      <Status>{getStateFromInstance(instance)}</Status>
                    </StatusElementsContainer>
                  </StatusWrapper>
                </VersionCardRowHover>
              ))}
          </InfoVersionContainer>
        </VersionCardBody>
        {this.props.modalState === ModalState.Version && <VersionModal template={this.props.template} />}
      </VersionOuterCard>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VersionCard);
