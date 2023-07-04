/* eslint-disable no-async-promise-executor */
import { appEnv } from "@providers/config/env";
import { NEW_RELIC_SAMPLE_RATE } from "@providers/constants/AnalyticsConstants";
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
    return new Promise(async (resolve, reject) => {
      // const shouldTrackTransaction = NEW_RELIC_ALLOWED_TRANSACTIONS.some((transaction) => event.includes(transaction));

      if (appEnv.general.IS_UNIT_TEST || skipTracking) {
        return resolve(callback());
      }

      if (Math.random() > NEW_RELIC_SAMPLE_RATE) {
        // Sample only a % of transactions to avoid eating our our quota massively
        return resolve(callback());
      }

      await newrelic.startBackgroundTransaction(event, category, () => {
        try {
          return resolve(callback());
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
