export enum ScrollDirection {
  Vertical,
  Horizontal
}
export class Scroller {
  timeStamp: number;

  _scroll: (item: EventTarget & Element, deltaScroll: number, mult: number) => void;
  constructor(scrollDirection: ScrollDirection = ScrollDirection.Vertical) {
    this.timeStamp = 0;
    if (scrollDirection == ScrollDirection.Vertical) {
      this._scroll = this.verticalScroll;
    } else {
      this._scroll = this.horizontalScroll;
    }
  }
  horizontalScroll = (item: EventTarget & Element, deltaScroll: number, mult: number) => {
    if (deltaScroll > 0) item.scrollLeft += 10 * mult;
    else item.scrollLeft -= 10 * mult;
  };

  verticalScroll = (item: EventTarget & Element, deltaScroll: number, mult: number) => {
    if (deltaScroll > 0) item.scrollTop += 10 * mult;
    else item.scrollTop -= 10 * mult;
  };

  scroll = (e: React.WheelEvent) => {
    e.preventDefault();
    var mult = 1;
    if (e.timeStamp - this.timeStamp < 1000) {
      mult = 10000 / (e.timeStamp - this.timeStamp);
    }
    this.timeStamp = e.timeStamp;
    this._scroll(e.currentTarget, e.deltaY, mult);
  };
}
