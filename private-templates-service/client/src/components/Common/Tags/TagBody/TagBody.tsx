import React, { Component } from 'react'
import { TagBodyContainer } from './styled';
import { TagText, TagCloseIcon } from '../styled';
import KeyCode from '../../../../globalKeyCodes';
import { ARIA_ROLE_BUTTON, TAG_DESCRIPTION } from '../../../../assets/strings';

interface Props {
  tag: string;
  onClick?: (tag: string) => void;
  allowEdit?: boolean;
  onAnimationEnd?: (e: any) => void;
  onKeyDownRemoveTag?: (tag: string, keyStroke: any) => void;
  tagRemove?: (tag: string) => void;
  ifModalState?: boolean;
  setRef?: (ref: HTMLDivElement) => void;
  toggleStyle?: (isSelected: boolean, ref: any) => void;
  isSelected?: boolean;
}

interface State {
  isSelected: boolean;
}

export class TagBody extends Component<Props, State> {
  ref: any;
  constructor(props: Props) {
    super(props)
    this.state = { isSelected: this.props.isSelected ? this.props.isSelected : false };
    this.ref = React.createRef();
  }
  componentDidMount = () => {
    if (this.props.setRef) {
      this.props.setRef(this.ref);
      if (this.props.onClick) {
        this.ref.current.style.cursor = "pointer";
      }
      if (this.state.isSelected && this.props.toggleStyle) {
        this.props.toggleStyle(!this.state.isSelected, this.ref);
      }
    }
  }

  onClick = () => {
    if (this.props.onClick) {
      if (this.props.toggleStyle) {
        this.props.toggleStyle(this.state.isSelected, this.ref);
      }
      this.setState({ isSelected: !this.state.isSelected });
      this.props.onClick(this.props.tag);
    }
  }

  onKeyDownTag = (keyStroke: any): void => {
    if (keyStroke.keyCode === KeyCode.ENTER) {
      this.onClick();
    }
  }

  render() {
    const { tag, allowEdit } = this.props;
    return (
      <TagBodyContainer ref={this.ref} onAnimationEnd={this.props.onAnimationEnd} key={tag}
        onClick={this.onClick}
        tabIndex={this.props.ifModalState ? -1 : 0} onKeyDown={this.onKeyDownTag}
        aria-label={`${tag} ${TAG_DESCRIPTION}`}
        aria-pressed={this.props.isSelected !== undefined ? this.state.isSelected : undefined}
        role={this.props.isSelected !== undefined ? ARIA_ROLE_BUTTON : undefined}>
        <TagText>{tag}</TagText>
        {allowEdit &&
          <TagCloseIcon key={tag} iconName="ChromeClose" onClick={this.props.tagRemove && (() => this.props.tagRemove!(tag))} tabIndex={this.props.ifModalState ? -1 : 0} onKeyDown={(event: any) => { this.props.onKeyDownRemoveTag!(tag, event) }} />}
      </TagBodyContainer>
    )
  }
}

export default TagBody;
