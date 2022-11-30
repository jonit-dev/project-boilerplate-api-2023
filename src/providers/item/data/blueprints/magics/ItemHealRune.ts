import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHealRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.HealRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/heal-rune.png",

  name: "Healing Rune",
  description: "An ancient healing rune.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  basePrice: 20,
  hasUseWith: true,

  useWithMaxDistanceGrid: 7,
  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.LifeHeal,
  projectileAnimationKey: AnimationEffectKeys.Blue,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.HealRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, points);
  },
};
