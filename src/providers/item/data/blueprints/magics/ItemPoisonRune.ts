import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.PoisonRune,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/poison-rune.png",
  name: "Poison Rune",
  description: "An ancient poison rune.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory, ItemSlotType.Inventory],
  basePrice: 20,

  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.Poison,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);
  },
};
