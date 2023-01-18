import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentSet, ItemSlotType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentTwoHanded)
export class EquipmentTwoHanded {
  constructor(private equipmentSlots: EquipmentSlots, private socketMessaging: SocketMessaging) {}

  public async validateHandsItemEquip(
    equipmentSlots: IEquipmentSet,
    itemToBeEquipped: IItem,
    character: ICharacter
  ): Promise<boolean> {
    const isItemEquippableOnHands = this.isItemEquippableOnHands(itemToBeEquipped);

    if (!isItemEquippableOnHands) {
      return true;
    }

    const hasOneHandedItemEquipped = await this.hasOneHandedItemEquippedOnArms(equipmentSlots);

    if (hasOneHandedItemEquipped) {
      if (itemToBeEquipped.isTwoHanded) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you can't equip a two-handed item together with the equipped item."
        );

        return false;
      }

      if (!itemToBeEquipped.isTwoHanded) {
        return true; //! allow equipping 2 one-handed items
      }
    }

    const hasTwoHandedItemEquipped = await this.hasTwoHandedItemEquippedOnArms(
      equipmentSlots as unknown as IEquipmentSet
    );

    if (hasTwoHandedItemEquipped) {
      if (itemToBeEquipped.isTwoHanded) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you already have a two-handed item equipped."
        );

        return false;
      }

      if (!itemToBeEquipped.isTwoHanded) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you already have an item equipped.");

        return false;
      }
    }

    return true;
  }

  public async hasTwoHandedItemEquippedOnArms(equipment: IEquipmentSet): Promise<boolean> {
    const leftHandItem = await Item.findById(equipment.leftHand);
    const rightHandItem = await Item.findById(equipment.rightHand);

    if (leftHandItem?.isTwoHanded || rightHandItem?.isTwoHanded) {
      return true;
    }
    return false;
  }

  public async hasOneHandedItemEquippedOnArms(equipment: IEquipmentSet): Promise<boolean> {
    const leftHandItem = await Item.findById(equipment.leftHand);
    const rightHandItem = await Item.findById(equipment.rightHand);

    if (leftHandItem?.isTwoHanded || rightHandItem?.isTwoHanded) return false;

    if (leftHandItem || rightHandItem) {
      return true;
    }

    return false;
  }

  public async checkTwoHandedEquip(equipment: IEquipmentSet): Promise<boolean> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);
    if (!equipmentSlots.leftHand && !equipmentSlots.rightHand) return true;

    return false;
  }

  public isItemEquippableOnHands(item: IItem): boolean {
    return !!(
      item.allowedEquipSlotType?.includes(ItemSlotType.LeftHand) ||
      item.allowedEquipSlotType?.includes(ItemSlotType.RightHand)
    );
  }
}
