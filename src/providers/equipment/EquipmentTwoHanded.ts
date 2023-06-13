import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IEquipmentSet, ItemSlotType, ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentTwoHanded)
export class EquipmentTwoHanded {
  constructor(private socketMessaging: SocketMessaging, private newRelic: NewRelic) {}

  public async validateHandsItemEquip(
    equipmentSlots: IEquipmentSet,
    itemToBeEquipped: IItem,
    character: ICharacter
  ): Promise<boolean> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "EquipmentTwoHanded.validateHandsItemEquip",
      async () => {
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
          } else {
            const hasShield = await this.hasShieldEquipped(equipmentSlots);

            if (hasShield) {
              return true;
            }

            // if item to be equipped is a shield, just allow it
            if (itemToBeEquipped.subType === ItemSubType.Shield) {
              return true;
            }

            this.socketMessaging.sendErrorMessageToCharacter(
              character,
              "Sorry, your class can't equip 2 one-handed item of this type."
            );

            return false;
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
            this.socketMessaging.sendErrorMessageToCharacter(
              character,
              "Sorry, not possible. Please unequip your two-handed item first."
            );

            return false;
          }
        }

        return true;
      }
    );
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

    if (leftHandItem?.isTwoHanded || rightHandItem?.isTwoHanded) {
      return false;
    }

    if (leftHandItem || rightHandItem) {
      return true;
    }

    return false;
  }

  public async hasShieldEquipped(equipment: IEquipmentSet): Promise<boolean> {
    const leftHandItem = await Item.findById(equipment.leftHand);
    const rightHandItem = await Item.findById(equipment.rightHand);

    if (leftHandItem?.subType === ItemSubType.Shield || rightHandItem?.subType === ItemSubType.Shield) {
      return true;
    }

    return false;
  }

  public isItemEquippableOnHands(item: IItem): boolean {
    return !!(
      item.allowedEquipSlotType?.includes(ItemSlotType.LeftHand) ||
      item.allowedEquipSlotType?.includes(ItemSlotType.RightHand)
    );
  }
}
