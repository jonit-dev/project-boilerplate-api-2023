import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  IEquipementSet,
  IItem,
  IUIShowMessage,
  UISocketEvents,
  IEquipmentRead,
  EquipmentSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentRead)
export class EquipmentRead {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onRead(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, EquipmentSocketEvents.ContainerRead, async (data: any, character) => {
      await this.onEquipmentRead(character);
    });
  }

  public async onEquipmentRead(character: ICharacter): Promise<void> {
    const equipmentSet = await Equipment.findById(character.equipment);

    if (!equipmentSet) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Equipment Set not found.",
        type: "error",
      });
      return;
    }

    const equipment = await this.getEquipmentSlots(equipmentSet._id);

    this.socketMessaging.sendEventToUser<IEquipmentRead>(character.channelId!, EquipmentSocketEvents.ContainerRead, {
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
