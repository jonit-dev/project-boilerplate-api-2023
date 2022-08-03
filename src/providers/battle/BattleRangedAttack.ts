import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item, IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { BowsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BattleSocketEvents,
  IBattleRangedAttackFailed,
  IEquipmentAndInventoryUpdatePayload,
  IRangedAttack,
  ItemSlotType,
  ItemSocketEvents,
  ItemSubType,
} from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";

interface IRequiredAmmo {
  location: string;
  id: Types.ObjectId;
  key: string;
  maxRange: number;
}

@provide(BattleRangedAttack)
export class BattleRangedAttack {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private mathHelper: MathHelper
  ) {}

  public sendNoAmmoEvent(character: ICharacter, target: ICharacter | INPC): void {
    this.socketMessaging.sendEventToUser<IBattleRangedAttackFailed>(
      character.channelId!,
      BattleSocketEvents.RangedAttackFailure,
      {
        targetId: target.id,
        type: target.type as EntityType,
        reason: "Ranged attack failed because character does not have enough ammo",
      }
    );
  }

  public sendNotInRangeEvent(character: ICharacter, target: ICharacter | INPC): void {
    this.socketMessaging.sendEventToUser<IBattleRangedAttackFailed>(
      character.channelId!,
      BattleSocketEvents.RangedAttackFailure,
      {
        targetId: target.id,
        type: target.type as EntityType,
        reason: "Ranged attack failed because target distance exceeds weapon max range",
      }
    );
  }

  public sendRangedAttackEvent(attacker: ICharacter, target: ICharacter | INPC, ammo: IRequiredAmmo): void {
    this.socketMessaging.sendEventToUser<IRangedAttack>(attacker.channelId!, ItemSocketEvents.RangedAttack, {
      attackerId: attacker.id,
      targetId: target.id,
      direction: this.mathHelper.getDirectionFromPoint({ x: attacker.x, y: attacker.y }, { x: target.x, y: target.y }),
      ammoKey: ammo.key,
    });
  }

  public async getAmmoForRangedAttack(weapon: IItem, equipment: IEquipment): Promise<IRequiredAmmo> {
    let result = {} as IRequiredAmmo;
    // Get ranged attack weapons (bow or spear)
    switch (weapon.subType) {
      case ItemSubType.Bow:
        // check if have enough arrows in inventory or equipment
        if (weapon.requiredAmmoKey !== BowsBlueprint.Arrow) {
          return result;
        }
        result = (await this.getRequiredAmmo(weapon.requiredAmmoKey, equipment)) as IRequiredAmmo;
        if (!_.isEmpty(result)) {
          result.maxRange = weapon.maxRange || 0;
        }
        break;
      // TODO: Implement Spear case
      // case ItemSubType.Spear:
      //   range = weapon.maxRange || 0;
      //   break;
    }
    return result;
  }

  private async getRequiredAmmo(requiredAmmoKey: string, equipment: IEquipment): Promise<Partial<IRequiredAmmo>> {
    // check if character has enough required ammo in inventory or equipment
    const accesory = await Item.findById(equipment.accessory);
    if (accesory && accesory.key === requiredAmmoKey) {
      return { location: ItemSlotType.Accessory, id: accesory._id, key: requiredAmmoKey };
    }

    if (!equipment.inventory) {
      return {} as IRequiredAmmo;
    }
    const backpack = equipment.inventory as unknown as IItem;
    const backpackContainer = await ItemContainer.findById(backpack.itemContainer);

    if (!backpackContainer) {
      throw new Error(`Backpack without item container. Item id ${backpack._id}`);
    }

    if (backpackContainer.emptySlotsQty === backpackContainer.slotQty) {
      return {} as IRequiredAmmo;
    }

    for (const item of await backpackContainer.items) {
      if (item.key === requiredAmmoKey) {
        return { location: ItemSlotType.Inventory, id: item._id, key: requiredAmmoKey };
      }
    }

    return {} as IRequiredAmmo;
  }

  /**
   * Consumes ammo from character's equipment accessory slot or inventory slot
   * and sends updateItemInventoryCharacter event
   */
  public async consumeAmmo(equipment: IEquipment, ammo: IRequiredAmmo, character: ICharacter): Promise<void> {
    const backpack = equipment.inventory as unknown as IItem;
    const backpackContainer = (await ItemContainer.findById(backpack.itemContainer)) as IItemContainer;

    switch (ammo.location) {
      case ItemSlotType.Accessory:
        equipment.accessory = undefined;
        await equipment.save();
        break;
      case ItemSlotType.Inventory:
        await this.equipmentEquip.removeItemFromInventory(ammo.id.toString(), backpackContainer);
        break;
      default:
        throw new Error("Invalid ammo location");
    }
    await Item.deleteOne({ _id: ammo.id });

    const equipmentSlots = await this.equipmentEquip.getEquipmentSlots(equipment._id);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
      inventory: {
        _id: backpack._id,
        parentItem: backpackContainer.parentItem.toString(),
        owner: backpackContainer.owner?.toString() || character.name,
        name: backpackContainer.name,
        slotQty: backpackContainer.slotQty,
        slots: backpackContainer.slots,
        allowedItemTypes: this.equipmentEquip.getAllowedItemTypes(),
        isEmpty: backpackContainer.isEmpty,
      },
    };

    this.equipmentEquip.updateItemInventoryCharacter(payloadUpdate, character);
  }
}
