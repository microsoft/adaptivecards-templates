import React, { Component } from "react";
import Tags from "../../Common/Tags";
import { Scroller, ScrollDirection } from "../../../utils/AllCardsUtil";
import { TagsContainer } from "./styled";

interface TagListProps {
  tags: string[];
  allowEdit: boolean;
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
  render() {
    return (
        <TagsContainer ref={this.ref}>
          <Tags tags={this.props.tags} allowEdit={this.props.allowEdit} />
        </TagsContainer>
    );
  }
}

export default TagList;
