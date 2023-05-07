import { IItem } from "@entities/ModuleInventory/ItemModel";
import { appEnv } from "@providers/config/env";
import {
  BasicAttribute,
  CombatSkill,
  IEquippableWeaponBlueprint,
  ItemSubType,
  ItemType,
  MinRequirements,
} from "@rpg-engine/shared";
import { itemsBlueprintIndex } from "./data";

export function getMinRequirements(blueprintKey: string, skillName: string): MinRequirements {
  const levelMultiplier = 0.2;
  const skillMultiplier = 0.3;
  const attackMultiplier = 0.3;
  const defenseMultiplier = 0.2;
  const twoHandedMultiplier = 0.4;
  const weightMultiplier = 0.2;
  const entityEffectMultiplier = 0.05;

  const itemBlueprint = itemsBlueprintIndex[blueprintKey];

  if (!itemBlueprint) {
    throw new Error(
      `Failed to calculate min item requirements: Item blueprint with key ${blueprintKey} does not exist.`
    );
  }

  const { attack, defense, isTwoHanded, weight, entityEffectChance } = itemBlueprint as IEquippableWeaponBlueprint;

  const attackReq = attack ? attack * attackMultiplier : 0;
  const defenseReq = defense ? defense * defenseMultiplier : 0;
  const isTwoHandedReq = isTwoHanded ? twoHandedMultiplier : 0;
  const weightReq = weight ? weight * weightMultiplier : 0;
  const entityEffectReq = entityEffectChance ? entityEffectChance * entityEffectMultiplier : 0;

  const totalReq = attackReq + defenseReq + isTwoHandedReq + weightReq + entityEffectReq;

  const levelReq = Math.ceil(totalReq * levelMultiplier);
  const skillReq = Math.ceil(totalReq * skillMultiplier);

  const minRequirements: MinRequirements = {
    level: levelReq,
    skill: {
      name: skillName,
      level: skillReq,
    },
  };

  return minRequirements;
}

export const getMinRequiredSkill = (item: IItem): BasicAttribute | CombatSkill => {
  if (item.type === ItemType.Armor) {
    if (item.subType === ItemSubType.Shield) {
      return CombatSkill.Shielding;
    }

    return BasicAttribute.Strength;
  }

  if (item.type === ItemType.Accessory) {
    return BasicAttribute.Dexterity;
  }

  if (item.type === ItemType.Weapon) {
    if (item.subType === ItemSubType.Sword) {
      return CombatSkill.Sword;
    }
    if (item.subType === ItemSubType.Dagger) {
      return CombatSkill.Dagger;
    }
    if (item.subType === ItemSubType.Axe) {
      return CombatSkill.Axe;
    }
    if (item.subType === ItemSubType.Mace) {
      return CombatSkill.Club;
    }
    if (item.subType === ItemSubType.Spear) {
      return CombatSkill.Distance;
    }
    if (item.subType === ItemSubType.Staff) {
      return BasicAttribute.Magic;
    }
    if (item.subType === ItemSubType.Ranged) {
      return CombatSkill.Distance;
    }

    if (item.subType === ItemSubType.Glove) {
      return CombatSkill.First;
    }
  }

  return BasicAttribute.Strength;
};

export const minItemLevelSkillRequirementsMiddleware = (data: IItem): IItem => {
  const item = data as IItem;

  if (appEnv.general.IS_UNIT_TEST) {
    // if its unit test, just skip this to avoid issues
    return item;
  }

  // if the item already has min requirements, just return what we set.
  // @ts-ignore
  if (item.minRequirements) {
    return item;
  }

  // else, automatically add minRequirements to all items tier 3+
  if (item.tier! >= 3) {
    const minRequirements = getMinRequirements(item.key, getMinRequiredSkill(item));

    // @ts-ignore
    item.minRequirements = minRequirements;

    return item;
  }

  return item;
};
