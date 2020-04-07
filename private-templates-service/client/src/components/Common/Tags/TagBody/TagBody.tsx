import React, { Component } from 'react'
import { TagBodyContainer } from './styled';
import { TagText, TagCloseIcon } from '../styled';
import { COLORS } from '../../../../globalStyles';

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
}

interface State {
    isSelected: boolean;
}

export class TagBody extends Component<Props, State> {
    ref: any;
    constructor(props: Props) {
        super(props)
        this.state = {isSelected: false};
        this.ref = React.createRef();
    }
    componentDidMount = () => {
      if(this.props.setRef) {
        this.props.setRef(this.ref);
        if(this.props.onClick) {
          this.ref.current.style.cursor = "pointer";
        }
      }
    }

    onClick = () => {
      if(this.props.onClick) {
        if(this.props.toggleStyle) {
          this.props.toggleStyle(this.state.isSelected, this.ref);
        }
        this.setState({isSelected: !this.state.isSelected});
        this.props.onClick(this.props.tag);
      }
    }

    render() {
      const { tag, allowEdit } = this.props;
        return (
            <TagBodyContainer ref={this.ref} onAnimationEnd={this.props.onAnimationEnd} key={tag} onClick={this.onClick}>
                <TagText>{tag}</TagText>
                {allowEdit &&
                    <TagCloseIcon key={tag} iconName="ChromeClose" onClick={this.props.tagRemove && (() => this.props.tagRemove!(tag))} tabIndex={this.props.ifModalState ? -1 : 0} onKeyDown={(event: any) => { this.props.onKeyDownRemoveTag!(tag, event) }} />}
            </TagBodyContainer>
        )
    }
}

export default TagBody;
