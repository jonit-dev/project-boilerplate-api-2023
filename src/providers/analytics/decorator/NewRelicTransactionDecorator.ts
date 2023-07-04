import { NewRelic } from "../NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";

export function TrackTransactionDecorator(): MethodDecorator {
  const newRelic = new NewRelic();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction: (...args: any[]) => any = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<any> {
      const className = target.constructor.name;
      const methodName = propertyKey;

      return await newRelic.trackPromiseTransaction(
        NewRelicTransactionCategory.Operation,
        `${className}.${methodName}`,
        originalFunction.apply(this, args)
      );
    };
  };
}
