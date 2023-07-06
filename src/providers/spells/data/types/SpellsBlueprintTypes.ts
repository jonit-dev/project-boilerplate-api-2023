import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import {
  BasicAttribute,
  CharacterAttributes,
  CharacterClass,
  CombatSkill,
  CraftingSkill,
  SpellCastingType,
} from "@rpg-engine/shared";

export enum SpellsBlueprint {
  SelfHealingSpell = "self-healing-spell",
  FoodCreationSpell = "food-creation-spell",
  ArrowCreationSpell = "arrow-creation-spell",
  BoltCreationSpell = "bolt-creation-spell",
  BlankRuneCreationSpell = "blank-rune-creation-spell",
  SelfHasteSpell = "self-haste-spell",
  FireRuneCreationSpell = "fire-rune-creation-spell",
  HealRuneCreationSpell = "healing-rune-creation-spell",
  PoisonRuneCreationSpell = "poison-rune-creation-spell",
  DarkRuneCreationSpell = "dark-rune-creation-spell",
  GreaterHealingSpell = "greater-healing-spell",
  EnergyBoltRuneCreationSpell = "energy-bolt-rune-creation-spell",
  FireBoltRuneCreationSpell = "fire-bolt-rune-creation-spell",
  FireBoltCreationSpell = "fire-bolt-creation-spell",
  PoisonArrowCreationSpell = "poison-arrow-creation-spell",
  CorruptionRuneCreationSpell = "corruption-rune-creation-spell",
  SpellDivineProtection = "spell-divine-protection",
  SpellPhysicalShield = "spell-physical-shield",
  SpellEagleEyes = "spell-eagle-eyes",
  ThunderRuneCreationSpell = "thunder-rune-creation-spell",
  WarriorStunTarget = "warrior-stun-target",
  RogueStealth = "rogue-stealth-spell",
  BerserkerBloodthirst = "berserker-bloodthirst",
  RogueExecution = "rogue-execution",
  ManaRegenSpell = "auto-mana-regen",
  HealthRegenSell = "auto-health-regen",
  ManaShield = "mana-shield",
  FortifyDefense = "fortify-defense",
  BerserkerExecution = "berserker-execution",
  HunterQuickFire = "hunter-quick-fire",
  BerserkerFrenzy = "berserker-frenzy",
  DruidShapeshift = "druid-shapeshift",
  BerserkerRage = "berserker-rage",
  Focus = "focus",
  PowerStrike = "power-strike",
  CurseOfWeakness = "curse-of-weakness",
  SpellPolymorph = "spell-polymorph",
  SorcererVeilofUndeath = "veil-of-undeath",
}

export interface ISpell {
  key: SpellsBlueprint;
  name: string;
  description: string;
  castingType: SpellCastingType;
  magicWords: string;
  manaCost: number;
  castingAnimationKey: string;
  targetHitAnimationKey: string;
  projectileAnimationKey: string;
  minLevelRequired: number;
  minMagicLevelRequired: number;
  cooldown: number;
  requiredItem?: MagicsBlueprint;
  characterClass?: CharacterClass[];
  attribute?: BasicAttribute | CombatSkill | CraftingSkill | CharacterAttributes;
  maxDistanceGrid?: number;
  usableEffect: (
    character: ICharacter,
    target?: ICharacter | INPC
  ) => Promise<boolean> | Promise<void> | void | boolean;
}

export enum NamespaceRedisControl {
  CharacterSpell = "character-spell",
  CharacterLastAction = "character-last-action",
  CharacterViewType = "character-view",
  CharacterFoodConsumption = "character-food-consumption",
  CharacterSpellCoolDown = "character-spell-cooldown",
}
