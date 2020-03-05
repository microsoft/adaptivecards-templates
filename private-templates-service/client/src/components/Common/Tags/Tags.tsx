import React from 'react';
import { connect } from 'react-redux';

import { updateTemplate } from '../../../store/currentTemplate/actions';
import { RootState } from '../../../store/rootReducer';

import { Template } from 'adaptive-templating-service-typescript-node';

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
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateTags: (tags: string[]) => {
      dispatch(updateTemplate(undefined, undefined, undefined, undefined, undefined, tags))
    }
  }
}

interface Props {
  tags?: string[];
  allowEdit?: boolean;
  allowAddTag?: boolean;
  templateID?: string;
  template?: Template;
  updateTags: (tags: string[]) => void;
}

interface State {
  isAdding: boolean;
  newTagName: string;
}

class Tags extends React.Component<Props, State>  {
  addTagInput = React.createRef<HTMLInputElement>();
  tagRefs: {[ref: string]: HTMLDivElement};

  constructor(props: Props) {
    super(props);
    this.state = {
      isAdding: false,
      newTagName: '',
    }
    this.tagRefs = {};
  }

  tagRemove = (tag: string) => {
    if (this.props.allowEdit && this.props.template && this.props.template.tags) {
      const newTags = this.props.template.tags.filter((existingTag: string) => existingTag !== tag);
      this.props.updateTags(newTags);
    }
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
    if (this.addTagInput && this.addTagInput.current && this.props.template && this.props.template.tags) {
      const tag = this.addTagInput.current.value;
      if(!this.props.template.tags.includes(tag)){
        if(tag === ""){
          this.closeAddTag();
        }
        else{
          this.props.updateTags([...this.props.template.tags, tag]);
       }
      }
      else{
        this.highlightTag(tag,this.props.template.tags)
      }
    }
  }

  highlightTag = (tagToHighlight: string, currentTags: string[]): void => {
    for(let tag of currentTags){
      if(tag === tagToHighlight){
        if (tag in this.tagRefs) {
          this.tagRefs[tag].classList.add('duplicate'); // Add the class that renders an animation
        }
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
    this.setState({newTagName: ""});
  }

  onKeyDown = (keyStroke: any) => {
    if(keyStroke.keyCode === 27){
      this.closeAddTag();
    }
  }

  render() {
    const {
      tags,
      allowAddTag
    } = this.props;

    const {
      isAdding
    } = this.state;

    return (
      <React.Fragment>
        {tags && tags.map((tag: string) => (
          <Tag ref={(ref: HTMLDivElement) => this.tagRefs[tag] = ref} onAnimationEnd={this.onAnimationEnd} key={tag}>
            <TagText>{tag}</TagText>
            <TagCloseIcon key={tag} iconName="ChromeClose" onClick={() => this.tagRemove(tag)} />
          </Tag>
        ))}
        {allowAddTag && <AddTagWrapper onSubmit={this.submitNewTag} open={isAdding}>
          <AddTagInput ref={this.addTagInput} open={isAdding} value={this.state.newTagName} onChange={this.handleChange} onBlur={this.closeAddTag} onKeyDown={this.onKeyDown} />
          <TagAddIcon iconName="Add" onClick={this.openNewTag} open={isAdding} />
          <TagSubmitButton type="submit" open={isAdding}>
            <TagSubmitIcon iconName="CheckMark" />
          </TagSubmitButton>
        </AddTagWrapper>}
      </React.Fragment>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Tags);
