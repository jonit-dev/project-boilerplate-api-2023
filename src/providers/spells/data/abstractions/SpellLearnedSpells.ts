import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ILearnedSpellsRead, ISpell, IUIShowMessage, SpellSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { spellsBlueprints } from "../blueprints";

@provide(SpellLearnedSpells)
export class SpellLearnedSpells {
  constructor(private socketMessaging: SocketMessaging) {}

  public async sendCharacterLearnedSpellsInfoEvent(character: ICharacter): Promise<void> {
    const { learnedSpells } = character;
    const learnedSpellsArr: ISpell[] = [];

    if (!learnedSpells) {
      this.sendNoSpellsAvailableMessage(character);
      return;
    }

    for (const spellKey of learnedSpells) {
      const spellBlueprint = spellsBlueprints[spellKey];
      if (spellBlueprint) {
        learnedSpellsArr.push(spellBlueprint);
      }
    }

    if (learnedSpellsArr.length > 0) {
      const skills = await Skill.findById(character.skills).cacheQuery({
        cacheKey: `${character?._id}-skills`,
      });

      if (!skills) {
        throw new Error("Failed to find character skills");
      }

      this.socketMessaging.sendEventToUser<ILearnedSpellsRead>(character.channelId!, SpellSocketEvents.LearnedSpells, {
        learnedSpells: learnedSpellsArr,
        magicLevel: skills.magic.level,
      });

      return;
    }

    this.sendNoSpellsAvailableMessage(character);
  }

  private sendNoSpellsAvailableMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "No spells available",
      type: "error",
    });
  }
}
