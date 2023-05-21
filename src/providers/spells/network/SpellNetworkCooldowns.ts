import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { SpellSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import SpellCoolDown from "../SpellCooldown";

@provide(SpellNetworkCooldowns)
export class SpellNetworkCooldowns {
  constructor(private socketAuth: SocketAuth, private spellCooldown: SpellCoolDown) {}

  public onSpellCooldownsRead(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      SpellSocketEvents.SpellCooldownsRead,
      async (_data, character: ICharacter) => {
        await this.spellCooldown.getAllSpellCooldowns(character);
      },
      true,
      false
    );
  }
}
