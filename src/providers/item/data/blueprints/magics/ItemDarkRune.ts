import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDarkRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.DarkRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/dark-rune.png",
  name: "Dark Rune",
  description: "An ancient dark rune.",
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  basePrice: 20,
  hasUseWith: true,
  maxStackSize: 100,
  useWithMaxDistanceGrid: 7,
  power: 17,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.HitDark,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.DarkRune, caster);

    ItemUsableEffect.apply(caster, EffectableAttribute.Mana, -1 * points);
    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);
  },
};
