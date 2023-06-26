import { appEnv } from "@providers/config/env";
import { NewRelicMetricCategory, NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import newrelic from "newrelic";

@provide(NewRelic)
export class NewRelic {
  public trackTransaction(
    category: NewRelicTransactionCategory,
    event: string,
    callback: () => void | Promise<void> | Promise<any>,
    skipTracking?: boolean
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (appEnv.general.IS_UNIT_TEST || skipTracking) {
        return resolve(callback());
      }

      newrelic.startBackgroundTransaction(event, category, async () => {
        try {
          const result = await callback();
          resolve(result);
        } catch (e) {
          console.error(e);
          reject(e);
        } finally {
          newrelic.endTransaction();
        }
      });
    });
  }

  public trackPromiseTransaction(
    category: NewRelicTransactionCategory,
    event: string,
    cb: Promise<(...args: unknown[]) => any>,
    skipTracking?: boolean
  ): Promise<any> {
    return new Promise((resolve, reject): void => {
      if (appEnv.general.IS_UNIT_TEST || skipTracking) {
        return resolve(cb);
      }

      newrelic.startBackgroundTransaction(event, category, async () => {
        try {
          const result = await cb;
          resolve(result);
        } catch (e) {
          console.error(e);
          reject(e);
        } finally {
          newrelic.endTransaction();
        }
      });
    });
  }

  public trackMetric(category: NewRelicMetricCategory, name: string, value: number): void {
    return newrelic.recordMetric(`${category}/${name}`, value);
  }
}
