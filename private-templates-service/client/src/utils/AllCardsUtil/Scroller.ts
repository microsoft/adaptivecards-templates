const SCROLL_SPEED: number = 10;
const SCROLL_MIN_TIME_DIFFERENCE: number = 1000; // ms
const SCROLL_ACCELERATION_MULTIPLIER: number = 10000;

export enum ScrollDirection {
  Vertical,
  Horizontal
}
export class Scroller {
  timeStamp: number;

  _scroll: (item: EventTarget & Element, deltaScroll: number, mult: number) => void;
  constructor(scrollDirection: ScrollDirection = ScrollDirection.Vertical) {
    this.timeStamp = 0;
    if (scrollDirection === ScrollDirection.Vertical) {
      this._scroll = this.verticalScroll;
    } else {
      this._scroll = this.horizontalScroll;
    }
  }
  horizontalScroll = (item: EventTarget & Element, deltaScroll: number, mult: number) => {
    if (deltaScroll > 0) item.scrollLeft += SCROLL_SPEED * mult;
    else item.scrollLeft -= SCROLL_SPEED * mult;
  };

  verticalScroll = (item: EventTarget & Element, deltaScroll: number, mult: number) => {
    if (deltaScroll > 0) item.scrollTop += SCROLL_SPEED * mult;
    else item.scrollTop -= SCROLL_SPEED * mult;
  };

  scroll = (e: React.WheelEvent) => {
    e.preventDefault();
    var mult = 1;
    if (e.timeStamp - this.timeStamp < SCROLL_MIN_TIME_DIFFERENCE) {
      mult = SCROLL_ACCELERATION_MULTIPLIER / (e.timeStamp - this.timeStamp);
    }
    this.timeStamp = e.timeStamp;
    this._scroll(e.currentTarget, e.deltaY, mult);
  };
}
