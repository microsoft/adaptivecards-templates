
export class Scroller {
  timeStamp: number;
  constructor() {
      this.timeStamp = 0;
  }
  // TODO: decide which scroll feels more natural
  verticalScroll = (e: React.WheelEvent) => {
      e.preventDefault();
      let item = e.currentTarget;
      if (e.timeStamp - this.timeStamp < 1000) {
          return;
      }
      this.timeStamp = e.timeStamp;
      item.scrollTop += 10 * e.deltaY;
  }
}