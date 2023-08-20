import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeight } from "@providers/character/weight/CharacterWeight";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { EquipmentSocketEvents, IEquipmentRead, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentRead)
export class EquipmentRead {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentSlots: EquipmentSlots,
    private characterWeight: CharacterWeight,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
  public async onEquipmentRead(character: ICharacter): Promise<void> {
    await clearCacheForKey(`${character._id}-equipment`);
    await this.inMemoryHashTable.delete("equipment-slots", character._id);

    const equipmentSet = await Equipment.findById(character.equipment)
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-equipment`,
      });

    if (!equipmentSet) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Equipment Set not found.",
        type: "error",
      });
      return;
    }

    await this.characterWeight.updateCharacterWeight(character);

    const equipment = await this.equipmentSlots.getEquipmentSlots(character._id, equipmentSet._id);

    this.socketMessaging.sendEventToUser<IEquipmentRead>(character.channelId!, EquipmentSocketEvents.ContainerRead, {
      equipment,
    });
  }
}
