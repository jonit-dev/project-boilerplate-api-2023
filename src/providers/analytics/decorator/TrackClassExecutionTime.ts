/* eslint-disable no-proto */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { performance } from "perf_hooks";

export function TrackClassExecutionTime(): ClassDecorator {
  return function (target: Function) {
    const keys = [
      ...Object.getOwnPropertyNames(target.prototype),
      ...Object.getOwnPropertyNames(target.prototype.__proto__),
    ];
    keys.forEach((propertyName) => {
      if (propertyName !== "constructor") {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
        if (descriptor && typeof descriptor.value === "function") {
          const originalMethod = descriptor.value;
          descriptor.value = function (...args: any[]): any {
            const className = target.name;
            const methodName = propertyName;
            const start = performance.now();
            const result = originalMethod.apply(this, args);

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

          Object.defineProperty(target.prototype, propertyName, descriptor);
        }
      }
    });

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
  };
}
