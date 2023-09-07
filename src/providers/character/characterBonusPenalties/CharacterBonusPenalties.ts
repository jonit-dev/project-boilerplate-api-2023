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
  SKILLS_MAP,
  ShadowWalkerRaces,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBasicAttributesBonusPenalties } from "./CharacterBasicAttributesBonusPenalties";
import { CharacterClassBonusOrPenalties } from "./CharacterClassBonusOrPenalties";
import { CharacterCombatBonusPenalties } from "./CharacterCombatBonusPenalties";
import { CharacterCraftingBonusPenalties } from "./CharacterCraftingBonusPenalties";
import { CharacterRaceBonusOrPenalties } from "./CharacterRaceBonusOrPenalties";

@provide(CharacterBonusPenalties)
export class CharacterBonusPenalties {
  constructor(
    private characterBasicAttributesBonusPenalties: CharacterBasicAttributesBonusPenalties,
    private characterCombatBonusPenalties: CharacterCombatBonusPenalties,
    private characterCraftingBonusPenalties: CharacterCraftingBonusPenalties,
    private skillFunctions: SkillFunctions,
    private characterClassBonusOrPenalties: CharacterClassBonusOrPenalties,
    private characterRaceBonusOrPenalties: CharacterRaceBonusOrPenalties
  ) {}

  public async applyRaceBonusPenalties(character: ICharacter, skillType: string): Promise<void> {
    const skills = (await Skill.findById(character.skills)
      .lean({
        virtuals: true,
        defaults: true,
      })
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;
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

    const raceBonusOrPenaltises = this.characterRaceBonusOrPenalties.getRaceBonusOrPenaltises(
      character.race as LifeBringerRaces | ShadowWalkerRaces
    );

    switch (character.race) {
      case LifeBringerRaces.Dwarf: {
        // This is the % of each SP attribute that will be increased or decreased
        // We can use positive or negative values Ex: Use 20% = 0.2 and -10% = -0.1

        // Update Basic Attributes
        basicAttributes = {
          stamina: raceBonusOrPenaltises.basicAttributes.stamina + classBonusOrPenalties.basicAttributes.stamina,
          strength: raceBonusOrPenaltises.basicAttributes.strength + classBonusOrPenalties.basicAttributes.strength,
          resistance:
            raceBonusOrPenaltises.basicAttributes.resistance + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: raceBonusOrPenaltises.basicAttributes.dexterity + classBonusOrPenalties.basicAttributes.dexterity,
          magic: raceBonusOrPenaltises.basicAttributes.magic + classBonusOrPenalties.basicAttributes.magic,
          magicResistance:
            raceBonusOrPenaltises.basicAttributes.magicResistance +
            classBonusOrPenalties.basicAttributes.magicResistance,
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
          first: raceBonusOrPenaltises.combatSkills.first + classBonusOrPenalties.combatSkills.first,
          sword: raceBonusOrPenaltises.combatSkills.sword + classBonusOrPenalties.combatSkills.sword,
          dagger: raceBonusOrPenaltises.combatSkills.dagger + classBonusOrPenalties.combatSkills.dagger,
          axe: raceBonusOrPenaltises.combatSkills.axe + classBonusOrPenalties.combatSkills.axe,
          distance: raceBonusOrPenaltises.combatSkills.distance + classBonusOrPenalties.combatSkills.distance,
          shielding: raceBonusOrPenaltises.combatSkills.shielding + classBonusOrPenalties.combatSkills.shielding,
          club: raceBonusOrPenaltises.combatSkills.club + classBonusOrPenalties.combatSkills.club,
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
          fishing: raceBonusOrPenaltises.craftingSkills.fishing + classBonusOrPenalties.craftingSkills.fishing,
          mining: raceBonusOrPenaltises.craftingSkills.mining + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking:
            raceBonusOrPenaltises.craftingSkills.lumberjacking + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: raceBonusOrPenaltises.craftingSkills.cooking + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: raceBonusOrPenaltises.craftingSkills.alchemy + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing:
            raceBonusOrPenaltises.craftingSkills.blacksmithing + classBonusOrPenalties.craftingSkills.blacksmithing,
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
          stamina: raceBonusOrPenaltises.basicAttributes.stamina + classBonusOrPenalties.basicAttributes.stamina,
          strength: raceBonusOrPenaltises.basicAttributes.strength + classBonusOrPenalties.basicAttributes.strength,
          resistance:
            raceBonusOrPenaltises.basicAttributes.resistance + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: raceBonusOrPenaltises.basicAttributes.dexterity + classBonusOrPenalties.basicAttributes.dexterity,
          magic: raceBonusOrPenaltises.basicAttributes.magic + classBonusOrPenalties.basicAttributes.magic,
          magicResistance:
            raceBonusOrPenaltises.basicAttributes.magicResistance +
            classBonusOrPenalties.basicAttributes.magicResistance,
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
          first: raceBonusOrPenaltises.combatSkills.first + classBonusOrPenalties.combatSkills.first,
          sword: raceBonusOrPenaltises.combatSkills.sword + classBonusOrPenalties.combatSkills.sword,
          dagger: raceBonusOrPenaltises.combatSkills.dagger + classBonusOrPenalties.combatSkills.dagger,
          axe: raceBonusOrPenaltises.combatSkills.axe + classBonusOrPenalties.combatSkills.axe,
          distance: raceBonusOrPenaltises.combatSkills.distance + classBonusOrPenalties.combatSkills.distance,
          shielding: raceBonusOrPenaltises.combatSkills.shielding + classBonusOrPenalties.combatSkills.shielding,
          club: raceBonusOrPenaltises.combatSkills.club + classBonusOrPenalties.combatSkills.club,
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
          fishing: raceBonusOrPenaltises.craftingSkills.fishing + classBonusOrPenalties.craftingSkills.fishing,
          mining: raceBonusOrPenaltises.craftingSkills.mining + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking:
            raceBonusOrPenaltises.craftingSkills.lumberjacking + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: raceBonusOrPenaltises.craftingSkills.cooking + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: raceBonusOrPenaltises.craftingSkills.alchemy + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing:
            raceBonusOrPenaltises.craftingSkills.blacksmithing + classBonusOrPenalties.craftingSkills.blacksmithing,
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
        basicAttributes = {
          stamina: raceBonusOrPenaltises.basicAttributes.stamina + classBonusOrPenalties.basicAttributes.stamina,
          strength: raceBonusOrPenaltises.basicAttributes.strength + classBonusOrPenalties.basicAttributes.strength,
          resistance:
            raceBonusOrPenaltises.basicAttributes.resistance + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: raceBonusOrPenaltises.basicAttributes.dexterity + classBonusOrPenalties.basicAttributes.dexterity,
          magic: raceBonusOrPenaltises.basicAttributes.magic + classBonusOrPenalties.basicAttributes.magic,
          magicResistance:
            raceBonusOrPenaltises.basicAttributes.magicResistance +
            classBonusOrPenalties.basicAttributes.magicResistance,
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
          first: raceBonusOrPenaltises.combatSkills.first + classBonusOrPenalties.combatSkills.first,
          sword: raceBonusOrPenaltises.combatSkills.sword + classBonusOrPenalties.combatSkills.sword,
          dagger: raceBonusOrPenaltises.combatSkills.dagger + classBonusOrPenalties.combatSkills.dagger,
          axe: raceBonusOrPenaltises.combatSkills.axe + classBonusOrPenalties.combatSkills.axe,
          distance: raceBonusOrPenaltises.combatSkills.distance + classBonusOrPenalties.combatSkills.distance,
          shielding: raceBonusOrPenaltises.combatSkills.shielding + classBonusOrPenalties.combatSkills.shielding,
          club: raceBonusOrPenaltises.combatSkills.club + classBonusOrPenalties.combatSkills.club,
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
          fishing: raceBonusOrPenaltises.craftingSkills.fishing + classBonusOrPenalties.craftingSkills.fishing,
          mining: raceBonusOrPenaltises.craftingSkills.mining + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking:
            raceBonusOrPenaltises.craftingSkills.lumberjacking + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: raceBonusOrPenaltises.craftingSkills.cooking + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: raceBonusOrPenaltises.craftingSkills.alchemy + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing:
            raceBonusOrPenaltises.craftingSkills.blacksmithing + classBonusOrPenalties.craftingSkills.blacksmithing,
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

      case ShadowWalkerRaces.Human: {
        basicAttributes = {
          stamina: raceBonusOrPenaltises.basicAttributes.stamina + classBonusOrPenalties.basicAttributes.stamina,
          strength: raceBonusOrPenaltises.basicAttributes.strength + classBonusOrPenalties.basicAttributes.strength,
          resistance:
            raceBonusOrPenaltises.basicAttributes.resistance + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: raceBonusOrPenaltises.basicAttributes.dexterity + classBonusOrPenalties.basicAttributes.dexterity,
          magic: raceBonusOrPenaltises.basicAttributes.magic + classBonusOrPenalties.basicAttributes.magic,
          magicResistance:
            raceBonusOrPenaltises.basicAttributes.magicResistance +
            classBonusOrPenalties.basicAttributes.magicResistance,
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
          first: raceBonusOrPenaltises.combatSkills.first + classBonusOrPenalties.combatSkills.first,
          sword: raceBonusOrPenaltises.combatSkills.sword + classBonusOrPenalties.combatSkills.sword,
          dagger: raceBonusOrPenaltises.combatSkills.dagger + classBonusOrPenalties.combatSkills.dagger,
          axe: raceBonusOrPenaltises.combatSkills.axe + classBonusOrPenalties.combatSkills.axe,
          distance: raceBonusOrPenaltises.combatSkills.distance + classBonusOrPenalties.combatSkills.distance,
          shielding: raceBonusOrPenaltises.combatSkills.shielding + classBonusOrPenalties.combatSkills.shielding,
          club: raceBonusOrPenaltises.combatSkills.club + classBonusOrPenalties.combatSkills.club,
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
          fishing: raceBonusOrPenaltises.craftingSkills.fishing + classBonusOrPenalties.craftingSkills.fishing,
          mining: raceBonusOrPenaltises.craftingSkills.mining + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking:
            raceBonusOrPenaltises.craftingSkills.lumberjacking + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: raceBonusOrPenaltises.craftingSkills.cooking + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: raceBonusOrPenaltises.craftingSkills.alchemy + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing:
            raceBonusOrPenaltises.craftingSkills.blacksmithing + classBonusOrPenalties.craftingSkills.blacksmithing,
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

      case ShadowWalkerRaces.Minotaur: {
        basicAttributes = {
          stamina: raceBonusOrPenaltises.basicAttributes.stamina + classBonusOrPenalties.basicAttributes.stamina,
          strength: raceBonusOrPenaltises.basicAttributes.strength + classBonusOrPenalties.basicAttributes.strength,
          resistance:
            raceBonusOrPenaltises.basicAttributes.resistance + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: raceBonusOrPenaltises.basicAttributes.dexterity + classBonusOrPenalties.basicAttributes.dexterity,
          magic: raceBonusOrPenaltises.basicAttributes.magic + classBonusOrPenalties.basicAttributes.magic,
          magicResistance:
            raceBonusOrPenaltises.basicAttributes.magicResistance +
            classBonusOrPenalties.basicAttributes.magicResistance,
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
          first: raceBonusOrPenaltises.combatSkills.first + classBonusOrPenalties.combatSkills.first,
          sword: raceBonusOrPenaltises.combatSkills.sword + classBonusOrPenalties.combatSkills.sword,
          dagger: raceBonusOrPenaltises.combatSkills.dagger + classBonusOrPenalties.combatSkills.dagger,
          axe: raceBonusOrPenaltises.combatSkills.axe + classBonusOrPenalties.combatSkills.axe,
          distance: raceBonusOrPenaltises.combatSkills.distance + classBonusOrPenalties.combatSkills.distance,
          shielding: raceBonusOrPenaltises.combatSkills.shielding + classBonusOrPenalties.combatSkills.shielding,
          club: raceBonusOrPenaltises.combatSkills.club + classBonusOrPenalties.combatSkills.club,
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
          fishing: raceBonusOrPenaltises.craftingSkills.fishing + classBonusOrPenalties.craftingSkills.fishing,
          mining: raceBonusOrPenaltises.craftingSkills.mining + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking:
            raceBonusOrPenaltises.craftingSkills.lumberjacking + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: raceBonusOrPenaltises.craftingSkills.cooking + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: raceBonusOrPenaltises.craftingSkills.alchemy + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing:
            raceBonusOrPenaltises.craftingSkills.blacksmithing + classBonusOrPenalties.craftingSkills.blacksmithing,
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
          stamina: raceBonusOrPenaltises.basicAttributes.stamina + classBonusOrPenalties.basicAttributes.stamina,
          strength: raceBonusOrPenaltises.basicAttributes.strength + classBonusOrPenalties.basicAttributes.strength,
          resistance:
            raceBonusOrPenaltises.basicAttributes.resistance + classBonusOrPenalties.basicAttributes.resistance,
          dexterity: raceBonusOrPenaltises.basicAttributes.dexterity + classBonusOrPenalties.basicAttributes.dexterity,
          magic: raceBonusOrPenaltises.basicAttributes.magic + classBonusOrPenalties.basicAttributes.magic,
          magicResistance:
            raceBonusOrPenaltises.basicAttributes.magicResistance +
            classBonusOrPenalties.basicAttributes.magicResistance,
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
          first: raceBonusOrPenaltises.combatSkills.first + classBonusOrPenalties.combatSkills.first,
          sword: raceBonusOrPenaltises.combatSkills.sword + classBonusOrPenalties.combatSkills.sword,
          dagger: raceBonusOrPenaltises.combatSkills.dagger + classBonusOrPenalties.combatSkills.dagger,
          axe: raceBonusOrPenaltises.combatSkills.axe + classBonusOrPenalties.combatSkills.axe,
          distance: raceBonusOrPenaltises.combatSkills.distance + classBonusOrPenalties.combatSkills.distance,
          shielding: raceBonusOrPenaltises.combatSkills.shielding + classBonusOrPenalties.combatSkills.shielding,
          club: raceBonusOrPenaltises.combatSkills.club + classBonusOrPenalties.combatSkills.club,
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
          fishing: raceBonusOrPenaltises.craftingSkills.fishing + classBonusOrPenalties.craftingSkills.fishing,
          mining: raceBonusOrPenaltises.craftingSkills.mining + classBonusOrPenalties.craftingSkills.mining,
          lumberjacking:
            raceBonusOrPenaltises.craftingSkills.lumberjacking + classBonusOrPenalties.craftingSkills.lumberjacking,
          cooking: raceBonusOrPenaltises.craftingSkills.cooking + classBonusOrPenalties.craftingSkills.cooking,
          alchemy: raceBonusOrPenaltises.craftingSkills.alchemy + classBonusOrPenalties.craftingSkills.alchemy,
          blacksmithing:
            raceBonusOrPenaltises.craftingSkills.blacksmithing + classBonusOrPenalties.craftingSkills.blacksmithing,
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
