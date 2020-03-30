import React from 'react';

import { ModalState } from '../../../../../store/page/types';

import { ActionButton, TooltipHost } from 'office-ui-fabric-react';

import { PostedTemplate } from 'adaptive-templating-service-typescript-node';

import * as STRINGS from '../../../../../assets/strings';
import { TooltipContainer } from '../../styled';

interface Props {
  val: any;
  templateState: PostedTemplate.StateEnum;
  openModal: (modalState: ModalState) => void;
  modalState?: ModalState;
}

const TooltipPublishButton = (props: Props) => {

  const onClick = () => {
    switch (props.templateState) {
      case PostedTemplate.StateEnum.Draft:
        props.openModal(ModalState.Publish);
        break;
      case PostedTemplate.StateEnum.Live:
        props.openModal(ModalState.Unpublish);
        break;
      case PostedTemplate.StateEnum.Deprecated:
        props.openModal(ModalState.Publish);
        break;
      default:
        break;
    }
  }

  const tooltipID = "tooltipPublishButton";

  return (
    <TooltipContainer>
      <TooltipHost id={tooltipID} content={props.templateState === PostedTemplate.StateEnum.Live ? STRINGS.UNPUBLISH_BUTTON_TOOLTIP : STRINGS.PUBLISH_BUTTON_TOOLTIP}>
        <ActionButton key={props.templateState === PostedTemplate.StateEnum.Live ? props.val.altText : props.val.text}
          iconProps={props.val.icon}
          allowDisabledFocus
          onClick={onClick}
          tabIndex={props.modalState ? -1 : 0}
          ariaDescription={tooltipID}>
          {props.templateState === PostedTemplate.StateEnum.Live ? props.val.altText : props.val.text}
        </ActionButton>
      </TooltipHost>
    </TooltipContainer>
  );
}



export default TooltipPublishButton;