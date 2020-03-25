export class Scroller {
    timeStamp: number;
    constructor() {
        this.timeStamp = 0;
    }
    // TODO: decide which scroll feels more natural
    horizontalScroll = (e: React.WheelEvent) => {
        e.preventDefault();
        let item = e.currentTarget;
        // if (e.deltaY > 0) item.scrollLeft += 100;
        // else item.scrollLeft -= 100;
        var mult = 1;;
        if (e.timeStamp - this.timeStamp < 1000) {
            mult = 10000 / (e.timeStamp - this.timeStamp);
            console.log(mult);
        }
        this.timeStamp = e.timeStamp;
        if (e.deltaY > 0) item.scrollLeft += 10 * mult;
        else item.scrollLeft -= 10 * mult;
    }
}
