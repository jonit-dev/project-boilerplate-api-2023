import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemView } from "@providers/item/ItemView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemPickupFromMap } from "../ItemPickupFromMap";

describe("ItemPickupFromMap", () => {
  let itemPickupFromMap: ItemPickupFromMap;
  let itemView: ItemView;
  let socketMessaging: SocketMessaging;
  let character: ICharacter;
  let item: IItem;

  beforeAll(() => {
    itemView = container.get(ItemView);
    socketMessaging = container.get(SocketMessaging);
    itemPickupFromMap = new ItemPickupFromMap(itemView, socketMessaging);
  });

  beforeEach(async () => {
    character = await unitTestHelper.createMockCharacter(null, { hasInventory: true, hasEquipment: true });
    item = await unitTestHelper.createMockItem();
  });

  describe("pickupFromMapContainer", () => {
    it("should successfully remove item from the map and return true", async () => {
      itemView.removeItemFromMap = jest.fn().mockResolvedValue(true);

      const result = await itemPickupFromMap.pickupFromMapContainer(item, character);
      expect(result).toBe(true);
      expect(itemView.removeItemFromMap).toHaveBeenCalledWith(item);
    });

    it("should fail to remove item from the map and return false", async () => {
      itemView.removeItemFromMap = jest.fn().mockResolvedValue(false);
      socketMessaging.sendErrorMessageToCharacter = jest.fn();

      const result = await itemPickupFromMap.pickupFromMapContainer(item, character);
      expect(result).toBe(false);
      expect(itemView.removeItemFromMap).toHaveBeenCalledWith(item);
      expect(socketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
        character,
        "Sorry, failed to remove item from map."
      );
    });
  });
});
