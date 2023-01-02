import { Item } from "@entities/ModuleInventory/ItemModel";
import nodeCron from "node-cron";
import { ItemDeleteCrons } from "../ItemDeleteCrons";

jest.mock("node-cron");
jest.mock("@entities/ModuleInventory/ItemModel");

describe("ItemDeleteCrons", () => {
  it("should schedule a cron job to delete items with x, y, and scene properties", () => {
    // Create an instance of the ItemDeleteCrons class
    const itemDeleteCrons = new ItemDeleteCrons();

    // Execute the schedule method
    itemDeleteCrons.schedule();

    // Expect node-cron's schedule method to be called with the correct arguments
    expect(nodeCron.schedule).toHaveBeenCalledWith("0 0 * * *", expect.any(Function));

    // Execute the cron job's callback function
    (nodeCron.schedule as jest.Mock).mock.calls[0][1]();

    // Expect Item.deleteMany to be called with the correct arguments
    expect(Item.deleteMany).toHaveBeenCalledWith({
      x: { $exists: true },
      y: { $exists: true },
      scene: { $exists: true },
    });
  });
});
