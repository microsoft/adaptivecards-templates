import React from 'react';
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { newTemplate } from "../../../store/currentTemplate/actions";

import { newTemplateURL } from '../../SideBar/SideBar';

import {
  DASHBOARD_RECENTLY_EDITED_PLACEHOLDER,
  DASHBOARD_PLACEHOLDER_BUTTON,
} from '../../../assets/strings';

import {
  PlaceholderWrapper,
  PlaceholderText,
  PlaceholderButton,
} from './styled';

const mapDispatchToProps = (dispatch: any) => {
  return {
    newTemplate: () => {
      dispatch(newTemplate());
    }
  };
};

interface Props {
  newTemplate: () => void;
}

const RecentlyEditedPlaceholder = (props: Props) => {

  const history = useHistory();

  const onNewCardClick = () => {
    props.newTemplate();
    history.push(newTemplateURL)
  }

  return (
    <PlaceholderWrapper>
      <PlaceholderText>
        {DASHBOARD_RECENTLY_EDITED_PLACEHOLDER}
      </PlaceholderText>
      <PlaceholderButton text={DASHBOARD_PLACEHOLDER_BUTTON} onClick={onNewCardClick} />
    </PlaceholderWrapper>
  );
}

export default connect(() => { return {} }, mapDispatchToProps)(RecentlyEditedPlaceholder);
