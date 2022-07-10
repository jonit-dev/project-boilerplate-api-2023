import { IItem, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemMock: Partial<IItem> = {
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxStackSize: 1,
  isUsable: false,
  isStorable: true,
  layer: 1,
  isItemContainer: false,
  isSolid: false,
  key: "short-sword-66",
  texturePath: "swords/short-sword.png",
  textureKey: "short-sword",
  name: "Short Sword",
  description: "You see a short sword. It is a single-handed sword with a handle that just features a grip.",
  attack: 5,
  defense: 0,
  weight: 1,
  tiledId: 66,
  x: 320,
  y: 144,
  scene: "Ilya",
  createdAt: "2022-06-25T22:53:55.579Z",
  updatedAt: "2022-06-28T04:42:21.409Z",
};

export const stackableItemMock: Partial<IItem> = {
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  isUsable: true,
  isStorable: true,
  isItemContainer: false,
  isSolid: false,
  key: "apple",
  texturePath: "foods/apple.png",
  textureKey: "apple",
  name: "Apple",
  description: "A red apple.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  scene: "Ilya",
  createdAt: "2022-06-25T22:53:55.579Z",
  updatedAt: "2022-06-28T04:42:21.409Z",
  stackQty: 1,
  maxStackSize: 10,
  isStackable: true,
};
