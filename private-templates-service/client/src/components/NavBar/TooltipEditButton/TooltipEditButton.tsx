import React from 'react';

import { ModalState } from '../../../store/page/types';

import { TooltipHost, ITooltipHostStyles } from 'office-ui-fabric-react';

import * as STRINGS from '../../../assets/strings';
import { EditButton } from '../styled';

const calloutProps = { gapSpace: 14.5 };

const inlineBlockStyle: Partial<ITooltipHostStyles> = {
  root: {
    display: 'inline-block',
    margin: 'auto'
  }
};

interface Props {
  editName: () => void;
  modalState?: ModalState;
}

const TooltipEditButton = (props: Props) => {
  const tooltipID = "tooltipEditButton";
  return (
    <TooltipHost id={tooltipID} content={STRINGS.EDIT_NAME_TOOLTIP} styles={inlineBlockStyle} calloutProps={calloutProps}>
      <EditButton ariaLabel="Edit Template Name"
        ariaDescription={tooltipID}
        onClick={props.editName}
        iconProps={{ iconName: 'Edit' }}
        tabIndex={props.modalState ? -1 : 0} />
    </TooltipHost>
  );
};

export default TooltipEditButton;