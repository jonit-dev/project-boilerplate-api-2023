import { provide } from "inversify-binding-decorators";

@provide(TimerWrapper)
export class TimerWrapper {
  setTimeout(fn: Function, timeout: number): ReturnType<typeof setTimeout> {
    return setTimeout(fn as any, timeout);
  }
}
