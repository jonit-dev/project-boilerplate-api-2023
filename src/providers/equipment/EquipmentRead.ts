import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { EquipmentSocketEvents, IEquipmentRead, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentRead)
export class EquipmentRead {
  constructor(private socketMessaging: SocketMessaging, private equipmentSlots: EquipmentSlots) {}

  public async onEquipmentRead(character: ICharacter): Promise<void> {
    const equipmentSet = await Equipment.findById(character.equipment).lean();

    if (!equipmentSet) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Equipment Set not found.",
        type: "error",
      });
      return;
    }

    const equipment = await this.equipmentSlots.getEquipmentSlots(equipmentSet._id);

    this.socketMessaging.sendEventToUser<IEquipmentRead>(character.channelId!, EquipmentSocketEvents.ContainerRead, {
      equipment,
    });
  }
}
