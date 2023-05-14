import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { SpellSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SpellLearnedSpells } from "../data/abstractions/SpellLearnedSpells";

@provide(SpellNetworkLearned)
export class SpellNetworkLearned {
  constructor(private socketAuth: SocketAuth, private spellsLearnedSpells: SpellLearnedSpells) {}

  public onGetDetails(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      SpellSocketEvents.LearnedSpells,
      // @ts-ignore
      (_data, character: ICharacter) => {
        this.spellsLearnedSpells.sendCharacterLearnedSpellsInfoEvent(character);
      }
    );
  }
}
