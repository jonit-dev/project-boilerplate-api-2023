import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import dayjs from "dayjs";

export const itemNPCBody: Partial<IItem> = {
  key: "female-npc-body",
  type: ItemType.Container,
  subType: ItemSubType.Body,
  textureAtlas: "death",
  texturePath: "woman.png",
  textureKey: "woman",
  name: "Woman's Body",
  description: "You see a female's body.",
  weight: 100,
  isStorable: false,
  isItemContainer: true, // this will automatically create a container once an this is spawned
  decayTime: dayjs(new Date()).add(1, "hour").toDate(),
};
