import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ITEM_USE_WITH_ENTITY_EFFECT_RATIO } from "@providers/constants/ItemConstants";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { itemUseWithEntityDarkRune } from "./useWithEntity/ItemUseWithEntityDarkRune";
import { itemUseWithEntityFireRune } from "./useWithEntity/ItemUseWithEntityFireRune";
import { itemUseWithEntityHealRune } from "./useWithEntity/ItemUseWithEntityHealRune";
import { itemUseWithEntityPoisonRune } from "./useWithEntity/ItemUseWithEntityPoisonRune";

const maxPoints = 100;

export async function calculateItemUseEffectPoints(
  item: Partial<IMagicItemUseWithEntity>,
  caster: ICharacter
): Promise<number> {
  const updatedCharacter = (await Character.findOne({ _id: caster._id }).populate("skills")) as unknown as ICharacter;
  const level = (updatedCharacter.skills as unknown as ISkill)?.magic?.level ?? 0;

  const minPoints = item.power ?? 0;

  return Math.round((level + (maxPoints - minPoints)) / (level + ITEM_USE_WITH_ENTITY_EFFECT_RATIO) + minPoints);
}

export interface IMagicItemUseWithEntity extends IItem {
  power: number;
  animationKey: string;
  projectileAnimationKey: string;
  minMagicLevelRequired: number;
}

export const useWithEntityBlueprintsIndex = {
  [MagicsBlueprint.DarkRune]: itemUseWithEntityDarkRune,
  [MagicsBlueprint.FireRune]: itemUseWithEntityFireRune,
  [MagicsBlueprint.HealRune]: itemUseWithEntityHealRune,
  [MagicsBlueprint.PoisonRune]: itemUseWithEntityPoisonRune,
};
