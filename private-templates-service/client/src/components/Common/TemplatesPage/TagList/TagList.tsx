import React, { Component } from "react";
import Tags from "../../Tags";
import { Scroller, ScrollDirection } from "../../../../utils/AllCardsUtil";
import { TagsContainer } from "./styled";

interface TagListProps {
  tags: string[];
  allowEdit: boolean;
  allowSetFavourite?: boolean;
  onClick?: (tag: string) => void;
  onSetFavourite?: (tag: string) => void;
  direction?: ScrollDirection;
  toggleStyle?: (isSelected: boolean, ref: any) => void;
  selectedTags?: string[];
}
class TagList extends Component<TagListProps> {
  scroller: Scroller;
  ref: any;

  constructor(props: TagListProps) {
    super(props);
    this.ref = React.createRef();
    this.scroller = new Scroller(ScrollDirection.Horizontal);
  }
  componentDidMount() {
    this.ref.current!.addEventListener("wheel", this.scroller.scroll, { passive: false });
  }
  componentWillUnmount() {
    if (this.ref.current) {
      this.ref.current.removeEventListener("wheel", this.scroller.scroll);
    }
  }
  
  getTagsFlexDirection = () => {
    if(this.props.direction && this.props.direction === ScrollDirection.Horizontal) {
      return "row";
    }
    return "column";
    
  }
  render() {

    const flexDirection = this.getTagsFlexDirection();
    return (
      <TagsContainer ref={this.ref} style={{flexDirection: flexDirection}}>
        <Tags tags={this.props.tags} selectedTags={this.props.selectedTags} 
              allowEdit={this.props.allowEdit} 
              onClick={this.props.onClick} 
              toggleStyle={this.props.toggleStyle} 
              allowSetFavourite={this.props.allowSetFavourite}
              onSetFavourite={this.props.onSetFavourite} />
      </TagsContainer>
    );
  }
}

export default TagList;
