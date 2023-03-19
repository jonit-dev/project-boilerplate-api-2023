import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemNinjaKunai: IEquippableWeaponBlueprint = {
  key: DaggersBlueprint.NinjaKunai,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/ninja-kunai.png",
  name: "Ninja Kunai",
  description:
    "A kunai is a traditional Japanese knife that was used as a farming tool and later became a popular weapon for ninjas. It has a pointed blade and a handle that can be wrapped with cord for grip.",
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 55,
};
