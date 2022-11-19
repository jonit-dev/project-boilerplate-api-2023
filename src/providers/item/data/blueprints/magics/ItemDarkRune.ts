import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/network/UseWithHelper";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IMagicItemUseWithEntity, MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDarkRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.DarkRune,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/dark-rune.png",
  name: "Dark Rune",
  description: "An ancient dark rune.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory, ItemSlotType.Inventory],
  basePrice: 20,

  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.Dark,
  projectileAnimationKey: AnimationEffectKeys.Hit,
  usableEffect: async (caster: ICharacter, target: ICharacter) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.DarkRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Mana, -1 * points);
  },
};
