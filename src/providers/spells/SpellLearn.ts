import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ISkill } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { spellsBlueprints } from "./data/blueprints/index";
import { ISpell } from "./data/types/SpellsBlueprintTypes";

@provide(SpellLearn)
export class SpellLearn {
  constructor(private socketMessaging: SocketMessaging) {}

  public async learnLatestSkillLevelSpells(characterId: string, notifyUser: boolean): Promise<void> {
    const character = (await Character.findOne({ _id: characterId }).populate("skills")) as unknown as ICharacter;
    const skills = character.skills as unknown as ISkill;

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

  private getSkillLevelSpells(level): ISpell[] {
    const spells: ISpell[] = [];
    for (const key in spellsBlueprints) {
      const spell = spellsBlueprints[key];
      if (spell.magicWords && level === spell.minLevelRequired) {
        spells.push(spell as unknown as ISpell);
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

    character.learnedSpells = learned;
    await character.save();
  }
}
