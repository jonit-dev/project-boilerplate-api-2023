import { NewRelicMetricCategory, NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import newrelic from "newrelic";

@provide(NewRelic)
export class NewRelic {
  public trackTransaction(
    category: NewRelicTransactionCategory,
    event: string,
    callback: () => void | Promise<void> | Promise<any>
  ): void {
    newrelic.startBackgroundTransaction(event, category, async () => {
      try {
        await callback();
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        newrelic.endTransaction();
      }
    });
  }

  public trackMetric(category: NewRelicMetricCategory, name: string, value: number): void {
    return newrelic.recordMetric(`${category}/${name}`, value);
  }
}
