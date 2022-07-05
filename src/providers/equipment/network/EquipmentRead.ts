import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IEquipementSet, IItem, ItemSocketEvents, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

export interface IEquipmentPayload {
  equipment: IEquipementSet;
}

export interface IEquipmentRead {
  equipment: IEquipementSet;
}

@provide(EquipmentRead)
export class EquipmentRead {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onRead(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.ContainerRead,
      async (data: IEquipmentPayload, character) => {
        await this.onEquipmentRead(data, character);
      }
    );
  }

  public async onEquipmentRead(data: IEquipmentRead, character: ICharacter): Promise<void> {
    const equipmentId = data.equipment?._id;
    const equipmentSet = await Equipment.findById(equipmentId);
    const equipmentCharacter = await Equipment.findById(character.equipment);

    if (!equipmentSet) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Equipment Set not found.",
        type: "error",
      });
      return;
    }

    const equipment = await this.getEquipmentSlots(equipmentSet._id);

    this.socketMessaging.sendEventToUser<IEquipmentRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
      equipment,
    });
  }

  public async getEquipmentSlots(equipmentId: string): Promise<IEquipementSet> {
    const equipment = await Equipment.findById(equipmentId)
      .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
      .exec();

    const head = equipment?.head! as unknown as IItem;
    const neck = equipment?.neck! as unknown as IItem;
    const leftHand = equipment?.leftHand! as unknown as IItem;
    const rightHand = equipment?.rightHand! as unknown as IItem;
    const ring = equipment?.ring! as unknown as IItem;
    const legs = equipment?.legs! as unknown as IItem;
    const boot = equipment?.boot! as unknown as IItem;
    const accessory = equipment?.accessory! as unknown as IItem;
    const armor = equipment?.armor! as unknown as IItem;
    const inventory = equipment?.inventory! as unknown as IItem;

    return {
      _id: equipment!._id,
      head,
      neck,
      leftHand,
      rightHand,
      ring,
      legs,
      boot,
      accessory,
      armor,
      inventory,
    } as IEquipementSet;
  }
}
