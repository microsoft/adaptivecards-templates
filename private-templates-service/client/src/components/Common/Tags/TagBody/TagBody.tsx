import React, { Component } from "react";
import { TagBodyContainer, TagSetFavouriteIcon } from "./styled";
import { TagText, TagCloseIcon } from "../styled";
import KeyCode from "../../../../globalKeyCodes";
import { ARIA_ROLE_BUTTON, TAG_DESCRIPTION } from "../../../../assets/strings";
import { COLORS } from "../../../../globalStyles";

interface FavouriteIcon {
  icon: string;
  color: string;
}

const favouriteSet: FavouriteIcon = { icon: "FavoriteStarFill", color: COLORS.ORANGE };
const favouriteNotSet: FavouriteIcon = { icon: "FavoriteStar", color: COLORS.GREY6 };

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
  allowSetFavorite?: boolean;
  onAddFavoriteTag?: (tag: string) => void;
  onRemoveFavoriteTag?: (tag: string) => void;
  isFavorite?: boolean;
}

interface State {
  isSelected: boolean;
  isFavorite: boolean;
  iconState: FavouriteIcon;
}

export class TagBody extends Component<Props, State> {
  ref: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      isSelected: this.props.isSelected ? this.props.isSelected : false,
      isFavorite: this.props.isFavorite ? this.props.isFavorite : false,
      iconState: this.props.isFavorite ? favouriteSet : favouriteNotSet,
    };
    this.ref = React.createRef();
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    if(this.props.isFavorite && this.props.isFavorite !== prevProps.isFavorite) {
      this.setFavouriteIcon(this.props.isFavorite);
    }
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
  };

  onClick = () => {
    if (this.props.onClick) {
      if (this.props.toggleStyle) {
        this.props.toggleStyle(this.state.isSelected, this.ref);
      }
      this.setState({ isSelected: !this.state.isSelected });
      this.props.onClick(this.props.tag);
    }
  };

  setFavouriteIcon = (isFavorite: boolean): void => {
    this.setState({ iconState: isFavorite ? favouriteSet : favouriteNotSet, isFavorite: isFavorite });
  };

  onSetFavorite = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (this.props.allowSetFavorite) {
      e.preventDefault();
      e.stopPropagation();
      if(this.props.onAddFavoriteTag && this.props.onRemoveFavoriteTag) {
        if(this.state.isFavorite) {
          this.props.onRemoveFavoriteTag(this.props.tag);
        } else {
          this.props.onAddFavoriteTag(this.props.tag);
        }
      }
      this.setFavouriteIcon(!this.state.isFavorite);
    }
  };

  onMouseOverFavourite = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    if (this.props.allowSetFavorite) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ iconState: favouriteSet });
    }
  };

  onMouseLeaveFavourite = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    if (this.props.allowSetFavorite) {
      e.preventDefault();
      e.stopPropagation();
      this.setFavouriteIcon(this.state.isFavorite);
    }
  };
  onKeyDownFavourite = (keyStroke: any): void => {
    if (keyStroke.keyCode === KeyCode.ENTER) {
      this.onSetFavorite(keyStroke);
    }
  };

  onKeyDownTag = (keyStroke: any): void => {
    if (keyStroke.keyCode === KeyCode.ENTER) {
      this.onClick();
    }
  };

  render() {
    const { tag, allowEdit, allowSetFavorite } = this.props;
    return (
      <TagBodyContainer
        ref={this.ref}
        onAnimationEnd={this.props.onAnimationEnd}
        key={tag}
        onClick={this.onClick}
        tabIndex={this.props.ifModalState ? -1 : 0}
        onKeyDown={this.onKeyDownTag}
        aria-label={`${tag} ${TAG_DESCRIPTION}`}
        aria-pressed={this.props.isSelected !== undefined ? this.state.isSelected : undefined}
        role={this.props.isSelected !== undefined ? ARIA_ROLE_BUTTON : undefined}
      >
        {allowSetFavorite && (
          <TagSetFavouriteIcon
            iconName={this.state.iconState.icon}
            onClick={this.onSetFavorite}
            onMouseOver={this.onMouseOverFavourite}
            onMouseLeave={this.onMouseLeaveFavourite}
            onKeyDown={this.onKeyDownFavourite}
            style={{ color: this.state.iconState.color }}
            tabIndex={0}
          />
        )}
        <TagText>{tag}</TagText>
        {allowEdit && (
          <TagCloseIcon
            key={tag}
            iconName="ChromeClose"
            onClick={this.props.tagRemove && (() => this.props.tagRemove!(tag))}
            tabIndex={this.props.ifModalState ? -1 : 0}
            onKeyDown={(event: any) => {
              this.props.onKeyDownRemoveTag!(tag, event);
            }}
          />
        )}
      </TagBodyContainer>
    );
  }
}

export default TagBody;
