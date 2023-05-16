import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ISpell, IUIShowMessage, SpellSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { spellsBlueprints } from "../data/blueprints/index";

@provide(SpellNetworkDetails)
export class SpellNetworkDetails {
  constructor(private socketauth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onGetDetails(channel: SocketChannel): void {
    this.socketauth.authCharacterOn(
      channel,
      SpellSocketEvents.SpellDetails,
      // eslint-disable-next-line require-await
      async ({ key }: { key: string }, character: ICharacter) => {
        let spellBlueprintKey: string | undefined;

        for (const spell in spellsBlueprints) {
          if (spell === key) {
            spellBlueprintKey = spell;
          }
        }

        if (!spellBlueprintKey) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Spell not found",
            type: "error",
          });
          return false;
        }

        const spellBlueprint = spellsBlueprints[spellBlueprintKey] as ISpell;

        this.socketMessaging.sendEventToUser<ISpell>(
          character.channelId!,
          SpellSocketEvents.SpellDetails,
          spellBlueprint
        );
      }
    );
  }
}
