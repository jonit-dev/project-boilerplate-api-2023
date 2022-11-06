import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType, MapLayers } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { BodiesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCharacterBody: Partial<IItem> = {
  key: BodiesBlueprint.CharacterBody,
  type: ItemType.Container,
  subType: ItemSubType.DeadBody,
  textureAtlas: "entities",
  texturePath: "kid-1/death/0.png",
  name: "Character's Body",
  description: "You see a character's body.",
  weight: 100,
  isStorable: false,
  isItemContainer: true, // this will automatically create a container once an this is spawned
  decayTime: dayjs(new Date()).add(1, "hour").toDate(),
  layer: MapLayers.OverGround, // avoid overlap with body
};
