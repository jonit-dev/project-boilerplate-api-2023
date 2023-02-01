import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnergyBoltRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.EnergyBoltRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/energy-bolt-rune.png",
  name: "Energy Bolt Rune",
  description: "An ancient Energy Bolt Rune.",
  weight: 0.01,
  maxStackSize: 100,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  basePrice: 80,
  hasUseWith: true,

  useWithMaxDistanceGrid: 7,
  power: 15,
  minMagicLevelRequired: 1,
  animationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.EnergyBoltRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
};
