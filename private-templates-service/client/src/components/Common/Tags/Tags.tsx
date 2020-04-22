import React, { RefObject } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../../store/rootReducer';
import { ModalState } from '../../../store/page/types';

import { Template } from 'adaptive-templating-service-typescript-node';

import KeyCode from '../../../globalKeyCodes';

import {
  AddTagWrapper,
  AddTagInput,
  TagAddIcon,
  TagSubmitButton,
  TagSubmitIcon,
} from './styled';
import TagBody from './TagBody';

const mapStateToProps = (state: RootState) => {
  return {
    template: state.currentTemplate.template,
    modalState: state.page.modalState
  }
}

interface Props {
  tags?: string[];
  allowEdit?: boolean;
  allowAddTag?: boolean;
  allowSetFavorite?: boolean;
  templateID?: string;
  template?: Template;
  updateTags?: (tags: string[]) => void;
  tagRemove?: (tag: string) => void;
  modalState?: ModalState;
  onClick?: (tag: string) => void;
  onAddFavoriteTag?: (tag: string) => void;
  onRemoveFavoriteTag?: (tag: string) => void;
  toggleStyle?: (isSelected: boolean, ref: any) => void;
  selectedTags?: string[];
  favoriteTags?: string[];
}

interface State {
  isAdding: boolean;
  newTagName: string;
}

class Tags extends React.Component<Props, State>  {
  addTagInput = React.createRef<HTMLInputElement>();
  tagRefs: { [ref: string]: RefObject<HTMLDivElement> };

  constructor(props: Props) {
    super(props);
    this.state = {
      isAdding: false,
      newTagName: '',
    }
    this.tagRefs = {};
  }


  openNewTag = () => {
    this.setState({ isAdding: true }, () => {
      if (this.addTagInput && this.addTagInput.current) {
        this.addTagInput.current.focus();
      }
    });
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event && event.currentTarget) {
      this.setState({ newTagName: event.currentTarget.value });
    }
  }

  submitNewTag = (e: any): void => {
    e.preventDefault();
    if (this.addTagInput && this.addTagInput.current && this.props.tags) {
      let tag = this.addTagInput.current.value.trim();
      if (this.props.tags.includes(tag)) {
        this.highlightTag(tag, this.props.tags);
      }
      else if (this.props.updateTags && tag !== "") {
        this.props.updateTags([...this.props.tags, tag]);
        this.setState({ newTagName: "" });
      }
    }
  }

  highlightTag = (tagToHighlight: string, currentTags: string[]): void => {
    for (let tag of currentTags) {
      if (tag === tagToHighlight && tag in this.tagRefs && this.tagRefs[tag].current && this.tagRefs[tag].current !== null) {
        this.tagRefs[tag].current!.classList.add('duplicate'); // Add the class that renders an animation
      }
    }
  }

  onAnimationEnd = (event: any) => {
    if (event && event.target) {
      event.target.classList.remove('duplicate'); // Once the animation is complete, remove the class from the component
    }
  }

  closeAddTag = () => {
    this.setState({ isAdding: false });
    this.setState({ newTagName: "" });
  }

  onKeyDown = (keyStroke: any) => {
    if (keyStroke.keyCode === KeyCode.ESC) {
      this.closeAddTag();
    }
  }

  onKeyDownAddTag = (keyStroke: any) => {
    if (keyStroke.keyCode === KeyCode.ENTER) {
      this.openNewTag();
    }
  }

  onKeyDownRemoveTag = (tag: string, keyStroke: any) => {
    if (this.props.tagRemove && keyStroke.keyCode === KeyCode.ENTER) {
      this.props.tagRemove(tag);
    }
  }

  render() {
    const {
      tags,
      allowAddTag,
      allowEdit,
      onClick,
      tagRemove,
      modalState,
      toggleStyle
    } = this.props;

    const {
      isAdding
    } = this.state;

    return (
      <React.Fragment>
        {tags && tags.map((tag: string) => (
          <TagBody setRef={(ref: any) => this.tagRefs[tag] = ref}
            tag={tag} tagRemove={tagRemove} onAnimationEnd={this.onAnimationEnd}
            key={tag} onClick={onClick} onKeyDownRemoveTag={this.onKeyDownRemoveTag}
            ifModalState={modalState ? true : false}
            allowEdit={allowEdit}
            toggleStyle={toggleStyle}
            isSelected={this.props.selectedTags ? (this.props.selectedTags.includes(tag) ? true : false) : undefined}
            isFavorite={this.props.favoriteTags ? (this.props.favoriteTags.includes(tag) ? true : false) : undefined}
            allowSetFavorite={this.props.allowSetFavorite}
            onAddFavoriteTag={this.props.onAddFavoriteTag}
            onRemoveFavoriteTag={this.props.onRemoveFavoriteTag}

          />
        ))}
        {allowAddTag && <AddTagWrapper onSubmit={this.submitNewTag} open={isAdding} >
          <AddTagInput ref={this.addTagInput} open={isAdding} value={this.state.newTagName} maxLength={30} onChange={this.handleChange} onKeyDown={this.onKeyDown} />
          <TagAddIcon iconName="Add" onClick={this.openNewTag} open={isAdding} onKeyDown={this.onKeyDownAddTag} tabIndex={this.props.modalState ? -1 : 0} />
          <TagSubmitButton type="submit" open={isAdding} >
            <TagSubmitIcon iconName="CheckMark" />
          </TagSubmitButton>
        </AddTagWrapper>}
      </React.Fragment>
    )
  }
}


export default connect(mapStateToProps)(Tags);
