/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { performance } from "perf_hooks";

export function TrackExecutionTime(): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction: (...args: any[]) => any = descriptor.value;

    descriptor.value = function (...args: any[]): any {
      const className = target.constructor.name;
      const methodName = propertyKey;
      const start = performance.now();

      const result = originalFunction.apply(this, args);

      if (result instanceof Promise) {
        return result.then((res) => {
          printDuration(className, methodName, start);
          return res;
        });
      } else {
        printDuration(className, methodName, start);
        return result;
      }
    };
  };

  function printDuration(className: string, methodName: string, start: number) {
    const duration = performance.now() - start;
    let color = "\x1b[0m"; // default to white
    if (duration < 1) {
      color = "\x1b[32m"; // green
    } else if (duration < 5) {
      color = "\x1b[33m"; // yellow
    } else {
      color = "\x1b[31m"; // red
    }

    console.log(color, `${className}.${methodName}: ${duration.toFixed(2)}ms\x1b[0m`);
  }
}
