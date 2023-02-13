import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IEquipItemPayload, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentEquip } from "../EquipmentEquip";

@provide(EquipmentEquipNetwork)
export class EquipmentEquipNetwork {
  constructor(private socketAuth: SocketAuth, private equipmentEquip: EquipmentEquip) {}

  public onItemEquip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.Equip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const { itemId, itemContainerId } = data;
        const result = await this.equipmentEquip.equip(character, itemId, itemContainerId);

        if (!result) {
          await Equipment.updateOne({ _id: character.equipment }, { $set: { isEquipping: false } });
        }
      }
    );
  }
}
