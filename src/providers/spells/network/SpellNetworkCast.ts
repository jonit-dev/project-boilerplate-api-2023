import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ISpellCast, SpellSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SpellCast } from "../SpellCast";

@provide(SpellNetworkCast)
export class SpellNetworkCast {
  constructor(private socketAuth: SocketAuth, private spellCast: SpellCast) {}

  public onSpellCast(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      SpellSocketEvents.CastSpell,
      async (data: ISpellCast, character: ICharacter) => {
        await this.spellCast.castSpell(data, character);
      },
      true,
      false
    );
  }
}
