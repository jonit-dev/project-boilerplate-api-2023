/* eslint-disable promise/always-return */
import { Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { provide } from "inversify-binding-decorators";
import * as path from "path";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: path.join(STATIC_PATH, "items_report.csv"),
  header: [
    { id: "name", title: "NAME" },
    { id: "owner", title: "OWNER" },
    { id: "type", title: "TYPE" },
    { id: "subType", title: "SUBTYPE" },
  ],
});

@provide(ItemReportGenerator)
export class ItemReportGenerator {
  @TrackNewRelicTransaction()
  public async exec(): Promise<void> {
    console.log("Starting to generate items report...");
    const items = await Item.find({}).lean(); // Assuming Item.find({}) returns a Promise that resolves to an array of items
    const records = items.map((item) => ({
      name: item.name,
      owner: item.owner,
      type: item.type,
      subType: item.subType,
    }));
    csvWriter
      .writeRecords(records)
      .then(() => {
        console.log("CSV report generated successfully.");
      })
      .catch((err) => {
        console.error("Failed to generate CSV report:", err);
      });
  }
}
