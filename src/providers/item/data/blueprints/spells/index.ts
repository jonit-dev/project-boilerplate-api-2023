import { SpellsBlueprint } from "../../types/itemsBlueprintTypes";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { SpellCastingType } from "@rpg-engine/shared";
import { itemSelfHealing } from "./ItemSelfHealing";

export type IItemSpell = IItem & {
  castingType: SpellCastingType;
  magicWords: string;
  manaCost: number;
  animationKey: string;
  projectileAnimationKey: string;
  minLevelRequired: number;
  minMagicLevelRequired: number;
};

export const spellsBlueprintsIndex = {
  [SpellsBlueprint.SelfHealingSpell]: itemSelfHealing,
};
