import { container } from "@providers/inversify/container";
import { ItemPickupUpdater } from "../ItemPickupUpdater";

describe("ItemPickupUpdater.ts", () => {
  let itemPickupUpdater: ItemPickupUpdater;

  beforeAll(() => {
    itemPickupUpdater = container.get<ItemPickupUpdater>(ItemPickupUpdater);
  });

  it("returns the correct list of allowed item types", () => {
    const mockGetAllowedItemTypes = jest.fn().mockReturnValue(["Weapon", "Armor"]);
    itemPickupUpdater.getAllowedItemTypes = mockGetAllowedItemTypes;

    // Call the getAllowedItemTypes method
    const allowedTypes = itemPickupUpdater.getAllowedItemTypes();

    // Verify that the returned list of types is correct

    expect(allowedTypes).toEqual(["Weapon", "Armor"]);
  });
});
