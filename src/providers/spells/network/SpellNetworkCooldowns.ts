import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ISpellCast } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import SpellCoolDown from "../SpellCooldown";

@provide(SpellNetworkCooldowns)
export class SpellNetworkCooldowns {
  constructor(private socketAuth: SocketAuth, private spellCooldown: SpellCoolDown) {}

  public onSpellCooldownsRead(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      "SpellCooldownsRead", // TODO: Add this to shared
      async (_data, character: ICharacter) => {
        await this.spellCooldown.getAllSpellCooldowns(character);
      },
      true,
      false
    );
  }
}
