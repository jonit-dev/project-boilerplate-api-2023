import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BowsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleRangedAttackFailed, IItem, ItemSlotType, ItemSubType } from "@rpg-engine/shared";
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
  constructor(private socketMessaging: SocketMessaging) {}

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

  public async getAmmoForRangedAttack(attacker: ICharacter): Promise<IRequiredAmmo> {
    const weapon = await attacker.weapon;
    let result = {} as IRequiredAmmo;
    // Get ranged attack weapons (bow or spear)
    switch (weapon.subType) {
      case ItemSubType.Bow:
        // check if have enough arrows in inventory or equipment
        if (weapon.requiredAmmoKey !== BowsBlueprint.Arrow) {
          return result;
        }
        result = (await this.getRequiredAmmo(weapon.requiredAmmoKey, attacker)) as IRequiredAmmo;
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

  private async getRequiredAmmo(requiredAmmoKey: string, attacker: ICharacter): Promise<Partial<IRequiredAmmo>> {
    // check if character has enough required ammo in inventory or equipment
    const equipment = await Equipment.findById(attacker.equipment).populate("inventory").exec();
    if (!equipment) {
      throw new Error(`equipment not found for character ${attacker.id}`);
    }

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
}
