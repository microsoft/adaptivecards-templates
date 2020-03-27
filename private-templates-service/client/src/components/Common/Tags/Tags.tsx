import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../../store/rootReducer';
import { ModalState } from '../../../store/page/types';

import { Template } from 'adaptive-templating-service-typescript-node';

import KeyCode from '../../../globalKeyCodes';

import {
  Tag,
  TagCloseIcon,
  TagText,
  AddTagWrapper,
  AddTagInput,
  TagAddIcon,
  TagSubmitButton,
  TagSubmitIcon,
} from './styled';

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
  templateID?: string;
  template?: Template;
  updateTags?: (tags: string[]) => void;
  tagRemove?: (tag: string) => void;
  modalState?: ModalState;
}

interface State {
  isAdding: boolean;
  newTagName: string;
}

class Tags extends React.Component<Props, State>  {
  addTagInput = React.createRef<HTMLInputElement>();
  tagRefs: { [ref: string]: HTMLDivElement };

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
      const tag = this.addTagInput.current.value;
      if (this.props.tags.includes(tag)) {
        this.highlightTag(tag, this.props.tags);
      }
      else if (tag === "") {
        //this.closeAddTag();
      }
      else if (this.props.updateTags) {
        this.props.updateTags([...this.props.tags, tag]);
        this.setState({ newTagName: "" });
      }
    }
  }

  highlightTag = (tagToHighlight: string, currentTags: string[]): void => {
    for (let tag of currentTags) {
      if (tag === tagToHighlight && tag in this.tagRefs) {
        this.tagRefs[tag].classList.add('duplicate'); // Add the class that renders an animation
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
      allowEdit
    } = this.props;

    const {
      isAdding
    } = this.state;
    console.log(this.props.modalState);
    return (
      <React.Fragment>
        {tags && tags.map((tag: string) => (
          <Tag ref={(ref: HTMLDivElement) => this.tagRefs[tag] = ref} onAnimationEnd={this.onAnimationEnd} key={tag}>
            <TagText>{tag}</TagText>
            {allowEdit &&
              <TagCloseIcon key={tag} iconName="ChromeClose" onClick={this.props.tagRemove && (() => this.props.tagRemove!(tag))} tabIndex={this.props.modalState ? -1 : 0} onKeyDown={(event: any) => { this.onKeyDownRemoveTag(tag, event) }} />}
          </Tag>
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
