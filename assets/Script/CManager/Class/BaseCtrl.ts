interface NormalCallback {
    (data: any): void
}
interface EventAndCtx {
    fn: NormalCallback,
    ctx: any
}
interface EventMap {
    [eventName: string]: EventAndCtx[]
}

export class BaseCtrl {
    private _eventMap: EventMap = {};

    protected runEventFn(event: string, params?) {
        let eventList: EventAndCtx[] = this._eventMap[event];
        if (eventList && eventList.length) {
            eventList.forEach(item => {
                if (item.ctx) {
                    item.fn.apply(item.ctx, [params]);
                } else {
                    item.fn(params);
                }
            })
        }
    }
    public on(event: string, callback: NormalCallback, ctx?: any) {
        let eventList: EventAndCtx[] = this._eventMap[event];
        if (eventList && eventList.length) {
            let hasCallback = false;
            for (let eventOp of eventList) {
                if (eventOp.fn === callback && eventOp.ctx === ctx) {
                    hasCallback = true;
                    break;
                }
            }
            if (!hasCallback) {
                eventList.push({ fn: callback, ctx });
            }
        } else {
            this._eventMap[event] = [{ fn: callback, ctx }];
        }
    }
    public off(event: string, callback: NormalCallback, ctx?: any) {
        let eventList: EventAndCtx[] = this._eventMap[event];
        if (eventList && eventList.length) {
            let hasCallback = false;
            let i = 0;
            for (let eventOp of eventList) {
                if (eventOp.fn === callback && eventOp.ctx === ctx) {
                    hasCallback = true;
                    break;
                }
                i++;
            }
            if (hasCallback) {
                eventList = eventList.splice(i, 1);
            }
        }
    }
}
