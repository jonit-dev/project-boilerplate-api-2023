import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.CorruptionRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/corruption-rune.png",
  name: "Corruption Rune",
  description: "The forbidden Corruption of Xoranth, the dark God, corrupts all who succumb to its influence",
  weight: 0.01,
  maxStackSize: 100,
  allowedEquipSlotType: [ItemSlotType.Inventory],

  hasUseWith: true,
  canUseOnNonPVPZone: false,
  useWithMaxDistanceGrid: 8,
  power: 23,
  canSell: false,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.DarkRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
};
