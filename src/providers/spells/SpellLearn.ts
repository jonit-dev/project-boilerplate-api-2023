import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ISkill } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { spellsBlueprints } from "./data/blueprints/index";
import { ISpell } from "./data/types/SpellsBlueprintTypes";

@provide(SpellLearn)
export class SpellLearn {
  constructor(private socketMessaging: SocketMessaging) {}

  public async learnLatestSkillLevelSpells(characterId: string, notifyUser: boolean): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    const spells = this.getSkillLevelSpells(skills.level);
    await this.addToCharacterLearnedSpells(character, spells);

    notifyUser && this.sendLearnedSpellNotification(character, spells);
  }

  private sendLearnedSpellNotification(character: ICharacter, spells: ISpell[]): void {
    if (!spells || spells.length < 1) {
      return;
    }
    const learned: string[] = [];
    spells.forEach((spell) => {
      learned.push(spell.name + " (" + spell.magicWords + ")");
    });

    this.socketMessaging.sendErrorMessageToCharacter(
      character,
      "You have learned new spell(s): " + learned.join(", "),
      "info"
    );
  }

  private getSkillLevelSpells(skillLevel: number, levelingSpells: boolean = false): ISpell[] {
    const spells: ISpell[] = [];

    for (const key in spellsBlueprints) {
      const spell = spellsBlueprints[key];

      if (levelingSpells) {
        if (spell.magicWords && skillLevel >= spell.minLevelRequired) {
          spells.push(spell as ISpell);
        }
      } else {
        if (spell.magicWords && skillLevel === spell.minLevelRequired) {
          spells.push(spell as ISpell);
        }
      }
    }
    return spells;
  }

  private async addToCharacterLearnedSpells(character: ICharacter, spells: ISpell[]): Promise<void> {
    const learned = character.learnedSpells ?? [];
    spells.forEach((spell) => {
      if (!learned.includes(spell.key)) {
        learned.push(spell.key);
      }
    });

    await Character.findByIdAndUpdate(
      {
        _id: character._id,
      },
      {
        learnedSpells: learned,
      }
    );
  }

  public async levelingSpells(characterId: Types.ObjectId, skillId: Types.ObjectId): Promise<boolean> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const skills = (await Skill.findById(skillId).lean()) as ISkill;

    const characterSpells = character.learnedSpells;
    if (!characterSpells) {
      return false;
    }

    const spells = this.getSkillLevelSpells(skills.level, true);
    const spellsKeys = _.map(spells, "key");

    const isEqual = _.isEqual(characterSpells.sort(), spellsKeys.sort());

    if (isEqual === false) {
      await this.addToCharacterLearnedSpells(character, spells);
      return true;
    }
    return false;
  }
}
