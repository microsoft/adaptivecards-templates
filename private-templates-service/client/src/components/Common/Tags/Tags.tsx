import React from 'react';

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

interface Props {
  tags: string[];
  allowAddTag: boolean;
}

interface State {
  isAdding: boolean;
  newTagName: string;
}

class Tags extends React.Component<Props, State>  {
  addTagInput = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      isAdding: false,
      newTagName: '',
    }
  }

  tagRemove = (tag: string) => {
    // TODO: kodyang REMOVE TAG
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
    // TODO: kodyang SUBMIT NEW TAG
    e.preventDefault();
    if (this.addTagInput && this.addTagInput.current) {
      const tag = this.addTagInput.current.value;
      console.log("new tag submitted: ", tag);
    }
  }

  closeAddTag = () => {
    this.setState({ isAdding: false });
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
          <Tag key={tag}>
            <TagText>{tag}</TagText>
            <TagCloseIcon key={tag} iconName="ChromeClose" onClick={() => this.tagRemove(tag)} />
          </Tag>
        ))}
        {allowAddTag && <AddTagWrapper onSubmit={this.submitNewTag} open={isAdding}>
          <AddTagInput ref={this.addTagInput} open={isAdding} value={this.state.newTagName} onChange={this.handleChange} />
          <TagAddIcon iconName="Add" onClick={this.openNewTag} open={isAdding} />
          <TagSubmitButton type="submit" open={isAdding}>
            <TagSubmitIcon iconName="CheckMark" />
          </TagSubmitButton>
        </AddTagWrapper>}
      </React.Fragment>
    )
  }
}


export default Tags;
