import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import {
  CharacterClass,
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
  ICraftingSkillsBonusAndPenalties,
  IIncreaseSPResult,
  LifeBringerRaces,
  ShadowWalkerRaces,
  SKILLS_MAP,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBasicAttributesBonusPenalties } from "./CharacterBasicAttributesBonusPenalties";
import { CharacterClassBonusOrPenalties } from "./CharacterClassBonusOrPenalties";
import { CharacterCombatBonusPenalties } from "./CharacterCombatBonusPenalties";
import { CharacterCraftingBonusPenalties } from "./CharacterCraftingBonusPenalties";

@provide(CharacterBonusPenalties)
export class CharacterBonusPenalties {
  constructor(
    private characterBasicAttributesBonusPenalties: CharacterBasicAttributesBonusPenalties,
    private characterCombatBonusPenalties: CharacterCombatBonusPenalties,
    private characterCraftingBonusPenalties: CharacterCraftingBonusPenalties,
    private skillFunctions: SkillFunctions,
    private characterClassBonusOrPenalties: CharacterClassBonusOrPenalties
  ) {}

  public async applyRaceBonusPenalties(character: ICharacter, skillType: string): Promise<void> {
    const skills = (await Skill.findById(character.skills)) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    const skillToUpdate = SKILLS_MAP.get(skillType);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillType}`);
    }
    let basicAttributes: IBasicAttributesBonusAndPenalties;
    let combatSkills: ICombatSkillsBonusAndPenalties;
    let craftingSkills: ICraftingSkillsBonusAndPenalties;

    let skillSpData: IIncreaseSPResult = {
      skillLevelUp: false,
      skillLevelBefore: 0,
      skillLevelAfter: 0,
      skillName: "",
      skillPoints: 0,
    };

    const classBonusOrPenalties = this.characterClassBonusOrPenalties.getClassBonusOrPenalties(
      character.class as CharacterClass
    );

    switch (character.race) {
      case LifeBringerRaces.Dwarf: {
        // This is the % of each SP attribute that will be increased or decreased
        // We can use positive or negative values Ex: Use 20% = 0.2 and -10% = -0.1

        // Update Basic Attributes
        basicAttributes = {
          stamina: 0.1 + classBonusOrPenalties.basicAttributes.stamina,
          strength: 0.2 + classBonusOrPenalties.basicAttributes.strength,
          resistance: 0.2 + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: -0.1 + classBonusOrPenalties.basicAttributes.dexterity,
          magic: -0.1 + classBonusOrPenalties.basicAttributes.magic,
          magicResistance: 0.2 + classBonusOrPenalties.basicAttributes.magicResistance,
        };

        if (skillToUpdate in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillToUpdate,
            basicAttributes
          );
        }

        // Update Combat Skills
        combatSkills = {
          first: 0.1 + classBonusOrPenalties.combatSkills.first,
          sword: 0.1 + classBonusOrPenalties.combatSkills.sword,
          dagger: 0.1 + classBonusOrPenalties.combatSkills.dagger,
          axe: 0.2 + classBonusOrPenalties.combatSkills.axe,
          distance: -0.1 + classBonusOrPenalties.combatSkills.distance,
          shielding: 0.1 + classBonusOrPenalties.combatSkills.shielding,
          club: 0.2 + classBonusOrPenalties.combatSkills.club,
        };

        if (skillToUpdate in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(
            skills,
            skillToUpdate,
            combatSkills
          );
        }

        // Update Crafting and Gathering Skills
        craftingSkills = {
          fishing: -0.1 + classBonusOrPenalties.craftingSkills.fishing,
          mining: 0.2 + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking: 0.2 + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: 0.1 + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: 0.1 + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing: 0 + classBonusOrPenalties.craftingSkills.blacksmithing,
        };

        if (skillToUpdate in craftingSkills) {
          skillSpData = await this.characterCraftingBonusPenalties.updateCraftingSkills(
            skills,
            skillToUpdate,
            craftingSkills
          );
        }

        break;
      }

      case LifeBringerRaces.Elf: {
        basicAttributes = {
          stamina: 0 + classBonusOrPenalties.basicAttributes.stamina,
          strength: -0.1 + classBonusOrPenalties.basicAttributes.strength,
          resistance: -0.1 + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: 0.1 + classBonusOrPenalties.basicAttributes.dexterity,
          magic: 0.1 + classBonusOrPenalties.basicAttributes.magic,
          magicResistance: 0.1 + classBonusOrPenalties.basicAttributes.magicResistance,
        };

        if (skillToUpdate in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillToUpdate,
            basicAttributes
          );
        }

        // Update Combat Skills
        combatSkills = {
          first: 0.1 + classBonusOrPenalties.combatSkills.first,
          sword: 0.1 + classBonusOrPenalties.combatSkills.sword,
          dagger: 0.1 + classBonusOrPenalties.combatSkills.dagger,
          axe: -0.1 + classBonusOrPenalties.combatSkills.axe,
          distance: 0.2 + classBonusOrPenalties.combatSkills.distance,
          shielding: 0.1 + classBonusOrPenalties.combatSkills.shielding,
          club: -0.1 + classBonusOrPenalties.combatSkills.club,
        };

        if (skillToUpdate in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(
            skills,
            skillToUpdate,
            combatSkills
          );
        }

        // Update Crafting Skills
        craftingSkills = {
          fishing: 0.1 + classBonusOrPenalties.craftingSkills.fishing,
          mining: 0.1 + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking: 0.1 + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: 0.1 + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: 0.1 + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing: 0.1 + classBonusOrPenalties.craftingSkills.blacksmithing,
        };

        if (skillToUpdate in craftingSkills) {
          skillSpData = await this.characterCraftingBonusPenalties.updateCraftingSkills(
            skills,
            skillToUpdate,
            craftingSkills
          );
        }
        break;
      }

      case LifeBringerRaces.Human: {
        // Do Nothing
        break;
      }

      case ShadowWalkerRaces.Human: {
        // Do Nothing
        break;
      }

      case ShadowWalkerRaces.Minotaur: {
        basicAttributes = {
          stamina: 0 + classBonusOrPenalties.basicAttributes.stamina,
          strength: 0.3 + classBonusOrPenalties.basicAttributes.strength,
          resistance: 0.2 + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: -0.2 + classBonusOrPenalties.basicAttributes.dexterity,
          magic: -0.2 + classBonusOrPenalties.basicAttributes.magic,
          magicResistance: 0.2 + classBonusOrPenalties.basicAttributes.magicResistance,
        };

        if (skillToUpdate in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillToUpdate,
            basicAttributes
          );
        }

        // Update Combat Skills
        combatSkills = {
          first: 0.1 + classBonusOrPenalties.combatSkills.first,
          sword: 0.1 + classBonusOrPenalties.combatSkills.sword,
          dagger: 0.1 + classBonusOrPenalties.combatSkills.dagger,
          axe: 0.3 + classBonusOrPenalties.combatSkills.axe,
          distance: -0.3 + classBonusOrPenalties.combatSkills.distance,
          shielding: 0.1 + classBonusOrPenalties.combatSkills.shielding,
          club: 0.3 + classBonusOrPenalties.combatSkills.club,
        };

        if (skillToUpdate in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(
            skills,
            skillToUpdate,
            combatSkills
          );
        }

        // Update Crafting and Gathering Skills
        craftingSkills = {
          fishing: 0.1 + classBonusOrPenalties.craftingSkills.fishing,
          mining: 0.1 + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking: 0.1 + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: 0.1 + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: 0.1 + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing: 0.1 + classBonusOrPenalties.craftingSkills.blacksmithing,
        };

        if (skillToUpdate in craftingSkills) {
          skillSpData = await this.characterCraftingBonusPenalties.updateCraftingSkills(
            skills,
            skillToUpdate,
            craftingSkills
          );
        }
        break;
      }

      case ShadowWalkerRaces.Orc: {
        basicAttributes = {
          stamina: 0 + classBonusOrPenalties.basicAttributes.stamina,
          strength: 0.2 + classBonusOrPenalties.basicAttributes.strength,
          resistance: 0.1 + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: -0.1 + classBonusOrPenalties.basicAttributes.dexterity,
          magic: -0.2 + classBonusOrPenalties.basicAttributes.magic,
          magicResistance: 0.2 + classBonusOrPenalties.basicAttributes.magicResistance,
        };

        if (skillToUpdate in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillToUpdate,
            basicAttributes
          );
        }

        // Update Combat Skills
        combatSkills = {
          first: 0.1 + classBonusOrPenalties.combatSkills.first,
          sword: 0.1 + classBonusOrPenalties.combatSkills.sword,
          dagger: 0.1 + classBonusOrPenalties.combatSkills.dagger,
          axe: 0.2 + classBonusOrPenalties.combatSkills.axe,
          distance: -0.2 + classBonusOrPenalties.combatSkills.distance,
          shielding: 0.1 + classBonusOrPenalties.combatSkills.shielding,
          club: 0.2 + classBonusOrPenalties.combatSkills.club,
        };

        if (skillToUpdate in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(
            skills,
            skillToUpdate,
            combatSkills
          );
        }

        // Update Crafting Skills
        craftingSkills = {
          fishing: 0.2 + classBonusOrPenalties.craftingSkills.fishing,
          mining: 0.1 + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking: 0.1 + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: -0.1 + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: -0.2 + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing: 0 + classBonusOrPenalties.craftingSkills.blacksmithing,
        };

        if (skillToUpdate in craftingSkills) {
          skillSpData = await this.characterCraftingBonusPenalties.updateCraftingSkills(
            skills,
            skillToUpdate,
            craftingSkills
          );
        }
        break;
      }

      default: {
        break;
      }
    }

    if (skillSpData.skillLevelUp) {
      await this.skillFunctions.sendSkillLevelUpEvents(skillSpData, character);
    }
  }
}
