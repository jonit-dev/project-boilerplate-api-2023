import { appEnv } from "@providers/config/env";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { NewRelic } from "../NewRelic";

export function TrackNewRelicTransaction(): MethodDecorator {
  const newRelic = new NewRelic();

  if (appEnv.general.IS_UNIT_TEST) {
    // just do nothing, we don't want to track transactions in unit tests. Furthermore, adding the async component to it causes it to become flaky.
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {};
  }

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
