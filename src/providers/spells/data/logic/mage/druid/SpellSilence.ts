import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";

@provide(SpellSilence)
export default class SpellSilence {
  private readonly silenceKey = "silenced";

  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  @TrackNewRelicTransaction()
  public async silenceCharacter(character: ICharacter, target: ICharacter | INPC, duration: number): Promise<void> {
    if (!(await this.isSilent(target))) {
      await this.inMemoryHashTable.set(this.silenceKey, target.id, true);

      // Use template literals for better readability.
      if (target.type === "Character") {
        this.socketMessaging.sendMessageToCharacter(
          target as ICharacter,
          `You can't cast any spell for ${duration} seconds (silenced)`
        );
      }
      this.socketMessaging.sendMessageToCharacter(character, `You've silenced ${target.name}!`);

      setTimeout(() => {
        this.inMemoryHashTable.delete(this.silenceKey, target.id).catch((err) => {
          console.error(
            `An error occurred while trying to delete ${this.silenceKey} from the in-memory hash table: `,
            err
          );
        });
      }, duration * 1000);
    }
  }

  public async isSilent(target: ICharacter | INPC): Promise<boolean> {
    return await this.inMemoryHashTable.has(this.silenceKey, target.id);
  }

  public async removeAllSilence(): Promise<void> {
    await this.inMemoryHashTable.deleteAll(this.silenceKey);
  }
}
