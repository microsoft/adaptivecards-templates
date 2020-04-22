import React from 'react';
import { connect } from 'react-redux';
import { Status, StatusIndicator } from '../../Dashboard/PreviewModal/TemplateInfo/styled';
import ModalHOC from '../../../utils/ModalHOC';
import { RootState } from '../../../store/rootReducer';
import { closeModal } from '../../../store/page/actions';
import { TagsState } from '../../../store/tags/types';
import { addFavoriteTags, removeFavoriteTags, getAllTags } from '../../../store/tags/actions';
import { updateTemplate } from '../../../store/currentTemplate/actions';
import { PostedTemplate } from 'adaptive-templating-service-typescript-node';
import * as AdaptiveCards from "adaptivecards";
import Tags from '../../Common/Tags';

import { Container, TemplateName, ACWrapper, TemplateFooterWrapper, TemplateStateWrapper } from '../../AdaptiveCardPanel/styled';
import {
  BackDrop,
  Modal,
  TitleWrapper,
  ColumnWrapper,
  InfoWrapper,
  ButtonWrapper,
  MiddleRowWrapper,
  Card,
  StyledTitle,
  StyledH3,
  TagsWrapper,
  StyledCancelButton,
  StyledSaveButton,
  StyledTextField
} from './styled';

import { UNTITLEDCARD, SAVETEXT, DRAFT, SAVE, CANCEL, SAVECARD, CARDNAME, TAGS, MYCARD } from '../../../assets/strings';

const mapStateToProps = (state: RootState) => {
  return {
    templateID: state.currentTemplate.templateID,
    templateJSON: state.currentTemplate.templateJSON,
    templateName: state.currentTemplate.templateName,
    sampleDataJSON: state.currentTemplate.sampleDataJSON,
    version: state.currentTemplate.version,
    allTags: state.tags
  }
}

interface Props {
  templateID?: string;
  templateName?: string;
  sampleDataJSON?: object;
  templateJSON?: object;
  designerSampleData?: any;
  designerTemplateJSON?: any;
  version?: string;
  closeModal: () => void;
  updateTemplate: (templateJSON?: object, sampleDataJSON?: object, templateName?: string, state?: PostedTemplate.StateEnum, tags?: string[]) => any;
  onAddFavoriteTag: (tag: string) => void;
  onRemoveFavoriteTag: (tag: string) => void;
  allTags: TagsState;
  getTags: () => void;
}

interface State {
  tags: string[];
  templateName: string;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
    updateTemplate: (templateJSON?: object, sampleDataJSON?: object, templateName?: string, templateState?: PostedTemplate.StateEnum, templateTags?: string[]) => {
      dispatch(updateTemplate(undefined, undefined, templateJSON, sampleDataJSON, templateName, templateState, templateTags));
    },
    onAddFavoriteTag: (tag: string) => {
      dispatch(addFavoriteTags(tag))
    },
    onRemoveFavoriteTag: (tag: string) => {
      dispatch(removeFavoriteTags(tag))
    },
    getTags: () => {
      dispatch(getAllTags());
    }
  }
}

class SaveModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { tags: [], templateName: UNTITLEDCARD }
  }

  componentDidMount() {
    this.props.getTags();
  }

  saveTags = (tagsToUpdate: string[]) => {
    this.setState({ tags: tagsToUpdate });
  }

  tagRemove = (tag: string) => {
    const newTags = this.state.tags.filter((existingTag: string) => existingTag !== tag);
    this.setState({ tags: newTags });
  }

  onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    if (newValue) {
      this.setState({ templateName: newValue });
    }
  }

  onClick = () => {
    // will only trigger on first save
    if (JSON.stringify(this.props.sampleDataJSON) !== JSON.stringify(this.props.designerTemplateJSON) || this.props.sampleDataJSON !== this.props.designerSampleData) {
      this.props.updateTemplate(this.props.designerTemplateJSON, this.props.designerSampleData, this.state.templateName, PostedTemplate.StateEnum.Draft, this.state.tags);
    }
    this.props.closeModal();
  }

  render() {
    const { allTags } = this.props;
    let adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    });
    adaptiveCard.parse(this.props.designerTemplateJSON);
    let renderedCard = adaptiveCard.render();

    let modalTitle = "saveModalTitle";

    let favoriteTags: string[] = [];
    if (!allTags.isFetching && allTags.allTags && allTags?.allTags.favoriteTags) {
      favoriteTags = allTags.allTags.favoriteTags;
    }
    return (
      <BackDrop>
        <Modal aria-label={SAVECARD}>
          <ColumnWrapper aria-labelledby={modalTitle}>
            <TitleWrapper>
              <StyledTitle>{SAVECARD}</StyledTitle>
              <div id={modalTitle}>{SAVETEXT}</div>
            </TitleWrapper>
            <MiddleRowWrapper>
              <Container style={{ margin: "0 80px 24px 0" }} >
                <ACWrapper>
                  <Card ref={n => {
                    // Work around for known issue: https://github.com/gatewayapps/react-adaptivecards/issues/10
                    n && n.firstChild && n.removeChild(n.firstChild);
                    n && n.appendChild(renderedCard);
                  }} />
                </ACWrapper>
                <TemplateFooterWrapper style={{ justifyContent: "space-between", paddingRight: "20px" }}>
                  <TemplateName>{UNTITLEDCARD}</TemplateName>
                  <TemplateStateWrapper style={{ justifyContent: "flex-end" }}>
                    <StatusIndicator state={PostedTemplate.StateEnum.Draft} />
                    <Status>{DRAFT}</Status>
                  </TemplateStateWrapper>
                </TemplateFooterWrapper>
              </Container>
              <InfoWrapper>
                <StyledH3>{CARDNAME}</StyledH3>
                <StyledTextField onChange={this.onChange} placeholder={MYCARD} defaultValue={UNTITLEDCARD} />
                <StyledH3>{TAGS}</StyledH3>
                <TagsWrapper>
                  <Tags updateTags={this.saveTags} tagRemove={this.tagRemove} tags={this.state.tags} allowAddTag={true} allowEdit={true} allowSetFavorite={true} onAddFavoriteTag={this.props.onAddFavoriteTag} onRemoveFavoriteTag={this.props.onRemoveFavoriteTag} favoriteTags={favoriteTags} />
                </TagsWrapper>
              </InfoWrapper>
            </MiddleRowWrapper>
            <ButtonWrapper>
              <StyledCancelButton text={CANCEL} onClick={this.props.closeModal} />
              <StyledSaveButton text={SAVE} onClick={this.onClick} />
            </ButtonWrapper>
          </ColumnWrapper>
        </Modal>
      </BackDrop>
    )
  }
}

export default ModalHOC(connect(mapStateToProps, mapDispatchToProps)(SaveModal));
