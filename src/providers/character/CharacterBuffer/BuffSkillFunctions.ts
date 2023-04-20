import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SkillCalculator } from "@providers/skill/SkillCalculator";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NamespaceRedisControl, SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import {
  BasicAttribute,
  CharacterClass,
  CharacterEntities,
  CharacterSocketEvents,
  CombatSkill,
  CraftingSkill,
  IAppliedBuffsEffect,
  ICharacterAttributeChanged,
  ISkillDetails,
  SkillType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

const basicAttributes: BasicAttribute[] = [
  BasicAttribute.Strength,
  BasicAttribute.Resistance,
  BasicAttribute.Dexterity,
  BasicAttribute.Magic,
  BasicAttribute.MagicResistance,
];

const combatSkills: CombatSkill[] = [
  CombatSkill.First,
  CombatSkill.Sword,
  CombatSkill.Dagger,
  CombatSkill.Axe,
  CombatSkill.Distance,
  CombatSkill.Shielding,
  CombatSkill.Club,
];

const craftingSkill: CraftingSkill[] = [
  CraftingSkill.Alchemy,
  CraftingSkill.Blacksmithing,
  CraftingSkill.Cooking,
  CraftingSkill.Fishing,
  CraftingSkill.Mining,
  CraftingSkill.Lumberjacking,
];

const characterEntities: CharacterEntities[] = [
  CharacterEntities.Speed,
  CharacterEntities.MaxMana,
  CharacterEntities.MaxHealth,
  CharacterEntities.AttackIntervalSpeed,
  CharacterEntities.Defense,
];

@provide(BuffSkillFunctions)
export class BuffSkillFunctions {
  constructor(
    private skillCalculator: SkillCalculator,
    private socketMessaging: SocketMessaging,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  /**
   * Positive buff will add level, negative buff will remove level
   * @param skills Skills
   * @param skillType Type of skill, BasicAttribute, CombatSkill, etc.
   * @param buffedLvl number of buffed lvl
   * @param isAdding adding or removing buff
   * @returns true if success
   */
  public async updateBuffSkillLevel(
    skills: ISkill,
    skillType: string,
    buffedLvl: number,
    isAdding: boolean
  ): Promise<boolean> {
    if (buffedLvl === 0) {
      return false;
    }

    const skill = skills[skillType] as ISkillDetails;

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${skills.owner}`;
    const key = skillType;
    const value = skill;

    if (isAdding) {
      skill.level += buffedLvl;
      await this.inMemoryHashTable.set(namespace, key, value);
    } else {
      skill.level = Math.max(Math.round(skill.level - buffedLvl), 1);
      await this.inMemoryHashTable.delete(namespace, key);
    }
    skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);

    const save = await Skill.findByIdAndUpdate(
      {
        _id: skills._id,
      },
      {
        ...skills,
      }
    );

    if (save) {
      return true;
    } else {
      return false;
    }
  }

  public async updateBuffEntities(
    characterId: Types.ObjectId,
    skillType: string,
    buffedLvl: number,
    isAdding: boolean
  ): Promise<boolean> {
    try {
      const character = (await Character.findById(characterId).lean({ virtuals: true })) as ICharacter;

      if (!character) {
        console.error(`Character with id ${characterId} not found`);
        return false;
      }

      if (buffedLvl === 0) {
        return false;
      }

      const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
      const key = skillType;

      const isAttackSpeed = skillType === CharacterEntities.AttackIntervalSpeed;
      if (isAdding) {
        if (isAttackSpeed) {
          character[skillType] = Math.max(500, Math.min(character[skillType], 1700));
          character.attackIntervalSpeed -= Math.min(Math.max(buffedLvl, 0), 1200);
        } else {
          character[skillType] += buffedLvl;
        }

        await this.inMemoryHashTable.set(namespace, key, isAttackSpeed ? buffedLvl : character[skillType]);
      } else {
        if (isAttackSpeed) {
          character[skillType] = Math.max(500, Math.min(character[skillType], 1700));
          character.attackIntervalSpeed += Math.min(Math.max(buffedLvl, 0), 1200);
        } else if (skillType === CharacterEntities.Speed) {
          character[skillType] = MovementSpeed.Standard;
        } else {
          character[skillType] = Math.max(character[skillType] - buffedLvl, 1);
        }
        await this.inMemoryHashTable.delete(namespace, key);
      }

      console.log(`Updated ${skillType} to ${character[skillType]} in ${character._id}`);

      const payload: ICharacterAttributeChanged = {
        targetId: character._id,
      };

      switch (skillType) {
        case CharacterEntities.MaxHealth: {
          if (character[skillType] < character.health) {
            character.health = character[skillType];
            payload.maxHealth = character[skillType];
            payload.health = character[skillType];
          } else {
            payload.maxHealth = character[skillType];
          }
          break;
        }

        case CharacterEntities.MaxMana: {
          if (character[skillType] < character.mana) {
            character.mana = character[skillType];
            payload.maxMana = character[skillType];
            payload.mana = character[skillType];
          } else {
            payload.maxMana = character[skillType];
          }
          break;
        }

        case CharacterEntities.Speed: {
          character.baseSpeed = character[skillType];
          character.speed = character[skillType];
          payload.speed = character.speed;
          break;
        }

        case CharacterEntities.AttackIntervalSpeed: {
          character.attackIntervalSpeed = character[skillType];
          payload.attackIntervalSpeed = character.attackIntervalSpeed;
          break;
        }

        default: {
          break;
        }
      }

      const savedCharacter = (await Character.findByIdAndUpdate({ _id: character._id }, { ...character }, { new: true })
        .lean()
        .select("channelId")) as ICharacter;

      if (!savedCharacter) {
        console.error(`Failed to save character with id ${character._id}`);
        return false;
      }

      this.socketMessaging.sendEventToUser(savedCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);

      return true;
    } catch (error) {
      console.error(`Error updating buff entities character id ${characterId}: ${error}`);
      return false;
    }
  }

  /**
   * This add or remove buff on character and return a object of type appliedBuffsEffect
   * if is adding, we dont need the _id param, but if is removing, we need the _id param
   * to search on array character.appliedBuffEffect
   * @param character character to update
   * @param skillType skyllType BasicAttributes,CombatSkill, etc.
   * @param diffLvl differencer of lvl
   * @param isAdding adding or removing
   * @param _id id of buff on array character.appliedBuffEffect
   * @returns an object of type appliedBuffsEffect
   */
  public async updateBuffEffectOnCharacter(
    characterId: Types.ObjectId,
    skillType: string,
    diffLvl: number,
    isAdding: boolean,
    _id?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    let appliedBuffsEffect: {
      _id: Types.ObjectId;
      key: string;
      value: number;
    } = {
      _id: _id || new Types.ObjectId(),
      key: skillType,
      value: diffLvl,
    };
    if (isAdding) {
      if (skillType === CharacterEntities.AttackIntervalSpeed) {
        const value = Math.min(Math.max(diffLvl, 0), 1200);
        appliedBuffsEffect = { ...appliedBuffsEffect, value };
      }
      await Character.updateOne(
        {
          _id: characterId,
        },
        {
          $push: {
            appliedBuffsEffects: appliedBuffsEffect,
          },
        }
      );
    } else {
      await Character.updateOne(
        {
          _id: characterId,
        },
        {
          $pull: {
            appliedBuffsEffects: {
              _id: appliedBuffsEffect._id,
            },
          },
        }
      );
    }

    return appliedBuffsEffect;
  }

  public async updateBuffXpOnCharacter(characterId: Types.ObjectId, key: string, buff: number): Promise<void> {
    const character = (await Character.findById(characterId)) as ICharacter;
    if (!character.appliedBuffsEffects) {
      return;
    }

    const existingEffect = character.appliedBuffsEffects.find((effect) => effect.key === key);

    if (existingEffect) {
      if (existingEffect.value >= 100) {
        return;
      }
      if (buff > 0 && existingEffect.value <= 100) {
        existingEffect.value += buff;
      } else if (buff < 0 && existingEffect.value > 0) {
        existingEffect.value -= buff * -1;
      }
    } else {
      const appliedBuffsEffect: IAppliedBuffsEffect = {
        _id: new Types.ObjectId(),
        key,
        value: buff,
      };
      character.appliedBuffsEffects.push(appliedBuffsEffect);
    }

    character.appliedBuffsEffects.forEach((xpBuff) => {
      xpBuff.value = Math.min(Math.max(xpBuff.value, 0), 100);
    });

    await Character.updateOne(
      {
        _id: character._id,
      },
      {
        $set: {
          appliedBuffsEffects: character.appliedBuffsEffects,
        },
      }
    );
  }

  /**
   * This functions remove all the buffs effects from a character.
   * @param character Character to remove all buffs.
   */
  public async removeAllBuffEffectOnCharacter(character: ICharacter): Promise<void> {
    if (!character) {
      throw new Error("Character not found");
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;

    const skills = (await Skill.findById(character.skills)) as ISkill;
    const appliedBuffsEffects = character.appliedBuffsEffects;

    if (appliedBuffsEffects) {
      const isAdding = false;
      const totalValues = this.sumBuffEffects(appliedBuffsEffects);

      for (let i = 0; i < totalValues.length; i++) {
        if (
          characterEntities.includes(totalValues[i].key as CharacterEntities) ||
          characterEntities.indexOf(totalValues[i].key as CharacterEntities) !== -1
        ) {
          if (totalValues[i].key !== CharacterEntities.Speed) {
            await this.updateBuffEntities(character._id, totalValues[i].key, totalValues[i].value, isAdding);
          }
        } else {
          if (totalValues[i].key !== "experience") {
            await this.updateBuffSkillLevel(skills, totalValues[i].key, totalValues[i].value, isAdding);
          }
        }

        const key = totalValues[i].key;
        await this.inMemoryHashTable.delete(namespace, key);
      }
    }

    await Character.updateOne({ _id: character._id }, { $set: { appliedBuffsEffects: [] } });
  }

  public async removeAllSpellDataOnRedis(character: ICharacter): Promise<void> {
    if (!character) {
      throw new Error("Character not found");
    }

    const classKeys = {
      [CharacterClass.None]: [],
      [CharacterClass.Rogue]: [],
      [CharacterClass.Hunter]: [SpellsBlueprint.SpellEagleEyes, SpellsBlueprint.HunterQuickFire],
      [CharacterClass.Berserker]: [SpellsBlueprint.BerserkerBloodthirst, SpellsBlueprint.BerserkerFrenzy],
      [CharacterClass.Warrior]: [SpellsBlueprint.HealthRegenSell, SpellsBlueprint.SpellPhysicalShield],
      [CharacterClass.Druid]: [
        SpellsBlueprint.ManaRegenSpell,
        SpellsBlueprint.SpellDivineProtection,
        SpellsBlueprint.DruidShapeshift,
      ],
      [CharacterClass.Sorcerer]: [
        SpellsBlueprint.ManaRegenSpell,
        SpellsBlueprint.SpellDivineProtection,
        SpellsBlueprint.SorcererManaShield,
      ],
    };

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const keysToDelete = classKeys[character.class];

    for (const key of keysToDelete) {
      await this.inMemoryHashTable.delete(namespace, key);
    }

    await this.inMemoryHashTable.delete(character._id, "totalAttack");
    await this.inMemoryHashTable.delete(character._id, "totalDefense");
  }

  /**
   * Return the type of skill.Example: BasicAttributes, CombatSkills, etc.
   * @param skillType Skill type to get the definition.
   * @returns a string with the skill type definition.
   */
  public getSkillTypeDefinition(skillType: string): string {
    let skillTypeDefinition = "";

    if (
      basicAttributes.includes(skillType as BasicAttribute) ||
      basicAttributes.indexOf(skillType as BasicAttribute) !== -1
    ) {
      return (skillTypeDefinition = SkillType.BasicAttributes);
    }

    if (combatSkills.includes(skillType as CombatSkill) || combatSkills.indexOf(skillType as CombatSkill) !== -1) {
      return (skillTypeDefinition = SkillType.Combat);
    }

    if (
      craftingSkill.includes(skillType as CraftingSkill) ||
      craftingSkill.indexOf(skillType as CraftingSkill) !== -1
    ) {
      return (skillTypeDefinition = SkillType.Crafting);
    }

    if (
      characterEntities.includes(skillType as CharacterEntities) ||
      characterEntities.indexOf(skillType as CharacterEntities) !== -1
    ) {
      return (skillTypeDefinition = SkillType.Character);
    }

    return skillTypeDefinition;
  }

  public calculateIncreaseLvl(currentLvl: number, percentage: number): number {
    if (percentage < 0) {
      return 0;
    } else {
      return Math.max(Math.ceil((currentLvl * percentage) / 100), 1);
    }
  }

  /**
   *
   * @param array array from character.appliedBuffsEffects
   * @param buffId _id of buff to get value
   * @returns return the value of buff on skill
   */
  public getValueByBuffId(
    array: { _id: Types.ObjectId; key: string; value: number }[],
    buffId: Types.ObjectId
  ): number {
    // @ts-ignore
    const result = array.filter((element) => element._id.equals(buffId));
    return result.length > 0 ? result[0].value : 0;
  }

  /**
   *
   * @param array array from character.appliedBuffsEffects
   * @param key the name of skill, strengh, magic, distance, etc.
   * @returns return the total of all values of buff on skill
   */
  public getTotalValueByKey(array: { key: string; value: number }[], key: string): number {
    const filteredArray = array.filter((element) => element.key === key);
    return filteredArray.length > 0 ? filteredArray.reduce((sum, current) => sum + current.value, 0) : 0;
  }

  public sumBuffEffects(buffs: IAppliedBuffsEffect[]): { key: string; value: number }[] {
    const keys = Array.from(new Set(buffs.map((buff) => buff.key)));
    const result = keys.map((key) => {
      const value = buffs.filter((buff) => buff.key === key).reduce((sum, buff) => sum + buff.value, 0);
      return { key, value };
    });
    return result;
  }
}
