import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import dayjs from "dayjs";

export const itemCharacterBody: Partial<IItem> = {
  key: "character-body",
  type: ItemType.Container,
  subType: ItemSubType.DeadBody,
  textureAtlas: "entities",
  texturePath: "kid-1/death/kid-1.png",
  textureKey: "character",
  name: "Character's Body",
  description: "You see a character's body.",
  weight: 100,
  isStorable: false,
  isItemContainer: true, // this will automatically create a container once an this is spawned
  decayTime: dayjs(new Date()).add(1, "hour").toDate(),
};