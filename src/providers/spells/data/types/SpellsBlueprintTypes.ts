import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MagicsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import {
  BasicAttribute,
  CharacterClass,
  CharacterEntities,
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
  EnergyBoltCreationSpell = "energy-bolt-creation-spell",
  FireBoltCreationSpell = "fire-bolt-creation-spell",
  CorruptionRuneCreationSpell = "corruption-rune-creation-spell",
  SpellMagicShield = "spell-magic-shield",
  SpellPhysicalShield = "spell-physical-shield",
  SpellEagleEyes = "spell-eagle-eyes",
  ThunderRuneCreationSpell = "thunder-rune-creation-spell",
  WarriorStunTarget = "warrior-stun-target",
  RogueExecution = "rogue-execution",
  ManaRegenSpell = "auto-mana-regen",
  HealthRegenSell = "auto-health-regen",
  SorcererManaShield = "sorcerer-mana-shield",
}

export interface ISpell {
  key: SpellsBlueprint;
  name: string;
  description: string;
  castingType: SpellCastingType;
  magicWords: string;
  manaCost: number;
  animationKey: string;
  projectileAnimationKey: string;
  minLevelRequired: number;
  minMagicLevelRequired: number;
  requiredItem?: MagicsBlueprint;
  characterClass?: CharacterClass[];
  attribute?: BasicAttribute | CombatSkill | CraftingSkill | CharacterEntities;
  maxDistanceGrid?: number;
  usableEffect: (
    character: ICharacter,
    target?: ICharacter | INPC
  ) => Promise<boolean> | Promise<void> | void | boolean;
}
