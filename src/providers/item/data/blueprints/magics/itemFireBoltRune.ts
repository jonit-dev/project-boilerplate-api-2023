import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireBoltRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.FireBoltRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/fire-bolt-rune.png",
  name: "Fire Bolt Rune",
  description: "An ancient Fire Bolt Rune.",
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  basePrice: 20,
  hasUseWith: true,
  maxStackSize: 100,
  useWithMaxDistanceGrid: 7,
  power: 15,
  minMagicLevelRequired: 1,
  animationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Red,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireBoltRune, caster);

    ItemUsableEffect.apply(caster, EffectableAttribute.Mana, -1 * points);
    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);
  },
};
