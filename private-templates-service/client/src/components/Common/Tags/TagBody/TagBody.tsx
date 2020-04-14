import React, { Component } from 'react'
import { TagBodyContainer, TagSetFavouriteIcon } from './styled';
import { TagText, TagCloseIcon } from '../styled';
import KeyCode from '../../../../globalKeyCodes';
import { ARIA_ROLE_BUTTON } from '../../../../assets/strings';


enum FavoriteIcon {
  NotSelected = "FavoriteStar",
  Selected = "FavoriteStarFill"
};

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
    allowSetFavourite?: boolean;
    onSetFavourite?: (tag: string) => void;
    isFavourite?: boolean;
  }

interface State {
    isSelected: boolean;
    isFavourite: boolean;
    favouriteIcon: FavoriteIcon;
}

export class TagBody extends Component<Props, State> {
    ref: any;
    constructor(props: Props) {
        super(props)
        this.state = {isSelected: this.props.isSelected? this.props.isSelected : false,
                      isFavourite: this.props.isFavourite? this.props.isFavourite : false,
                      favouriteIcon: this.props.isFavourite? FavoriteIcon.Selected : FavoriteIcon.NotSelected };
        this.ref = React.createRef();
    }
    componentDidMount = () => {
      if(this.props.setRef) {
        this.props.setRef(this.ref);
        if(this.props.onClick) {
          this.ref.current.style.cursor = "pointer";
        }
        if(this.state.isSelected && this.props.toggleStyle) {
          this.props.toggleStyle(!this.state.isSelected, this.ref);
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

    setFavouriteIcon = (isFavourite: boolean):void => {
      this.setState({favouriteIcon: isFavourite? FavoriteIcon.Selected : FavoriteIcon.NotSelected,
                     isFavourite: isFavourite});
    }

    onSetFavourite = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if(this.props.allowSetFavourite) {
        e.preventDefault();
        e.stopPropagation();
        this.setFavouriteIcon(!this.state.isFavourite);
      }
    }

    onMouseOverFavourite = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
      if(this.props.allowSetFavourite) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({favouriteIcon: FavoriteIcon.Selected});
      }
    }

    onMouseLeaveFavourite = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
      if(this.props.allowSetFavourite) {
        e.preventDefault();
        e.stopPropagation();
        this.setFavouriteIcon(this.state.isFavourite);
      }
    }
    onKeyDownFavourite = (keyStroke: any): void => {
      if (keyStroke.keyCode === KeyCode.ENTER) {
        this.onSetFavourite(keyStroke);
      }
    }
    
    onKeyDownTag = (keyStroke: any): void => {
      if (keyStroke.keyCode === KeyCode.ENTER) {
        this.onClick();
      }
    }

    render() {
      const { tag, allowEdit, allowSetFavourite } = this.props;
        return (
            <TagBodyContainer ref={this.ref} onAnimationEnd={this.props.onAnimationEnd} key={tag} 
                              onClick={this.onClick} 
                              tabIndex={this.props.ifModalState ? -1 : 0} onKeyDown={this.onKeyDownTag}
                              aria-label={`${tag} Tag`}
                              aria-pressed={this.props.isSelected !== undefined ? this.state.isSelected : undefined}
                              role={this.props.isSelected !== undefined ? ARIA_ROLE_BUTTON : undefined}
                              >
                {allowSetFavourite && 
                  <TagSetFavouriteIcon iconName={this.state.favouriteIcon} 
                                       onClick={this.onSetFavourite} 
                                       onMouseOver={this.onMouseOverFavourite} 
                                       onMouseLeave={this.onMouseLeaveFavourite}
                                       onKeyDown={this.onKeyDownFavourite}
                                       tabIndex={0} />
                }                                
                <TagText>{tag}</TagText>
                {allowEdit &&
                    <TagCloseIcon key={tag} iconName="ChromeClose" onClick={this.props.tagRemove && (() => this.props.tagRemove!(tag))} tabIndex={this.props.ifModalState ? -1 : 0} onKeyDown={(event: any) => { this.props.onKeyDownRemoveTag!(tag, event) }} />}
            </TagBodyContainer>
        )
    }
}

export default TagBody;
