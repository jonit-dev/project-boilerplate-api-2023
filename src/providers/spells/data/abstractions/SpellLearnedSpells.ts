import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, SpellSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { spellsBlueprints } from "../blueprints";
import { ISpell } from "../types/SpellsBlueprintTypes";

@provide(SpellLearnedSpells)
export class SpellLearnedSpells {
  constructor(private socketMessaging: SocketMessaging) {}

  public sendCharacterLearnedSpellsInfoEvent(character: ICharacter): ISpell[] | undefined {
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
      this.socketMessaging.sendEventToUser<ISpell[]>(
        character.channelId!,
        SpellSocketEvents.LearnedSpells,
        learnedSpellsArr
      );

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
