import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
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
  MapLayers,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { MovementHelper } from "@providers/movement/MovementHelper";

interface IRangedAttackParams {
  location: string;
  id: Types.ObjectId;
  key: string;
  maxRange: number;
  equipment?: IEquipment;
}

@provide(BattleRangedAttack)
export class BattleRangedAttack {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private mathHelper: MathHelper,
    private movementHelper: MovementHelper
  ) {}

  /**
   * Validates the ranged attack based on ranged attack max range, ammo available
   * (in case of a character) and if solids are in the attack trajectory
   * @param attacker data
   * @param target data
   * @returns ranged attack parameters if is a valid attack or undefined is invalid
   */
  public async validateAttack(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC
  ): Promise<IRangedAttackParams | undefined> {
    let rangedAttackParams: Partial<IRangedAttackParams> | undefined;
    let equipment: IEquipment;

    if (attacker.type === "NPC") {
      const npc = attacker as INPC;
      if (!npc.maxRangeAttack) {
        throw new Error("NPC attempted ranged attack without specifying maxRangeAttack field");
      }
      rangedAttackParams = { maxRange: npc.maxRangeAttack };
    } else {
      const character = attacker as ICharacter;
      // Get equipment to validate if character has ranged attack ammo (bow -> arrow or spear)
      equipment = (await Equipment.findById(character.equipment).populate("inventory").exec()) as IEquipment;
      if (!equipment) {
        throw new Error(`equipment not found for character ${character.id}`);
      }

      rangedAttackParams = await this.getAmmoForRangedAttack(await character.weapon, equipment);
      if (!rangedAttackParams) {
        this.sendNoAmmoEvent(character, target);
        return;
      }
    }

    // check if distance between attacker and target is
    // within the ranged weapon max range
    const isUnderDistanceRange = this.movementHelper.isUnderRange(
      attacker.x,
      attacker.y,
      target.x,
      target.y,
      rangedAttackParams.maxRange!
    );

    if (!isUnderDistanceRange) {
      if (attacker.type === "Character") {
        this.sendNotInRangeEvent(attacker as ICharacter, target);
      }
      return;
    }

    // check if there's a solid in ranged attack trajectory
    const solidInTrajectory = await this.solidInTrajectory(attacker, target);
    if (solidInTrajectory) {
      if (attacker.type === "Character") {
        this.sendSolidInTrajectoryEvent(attacker as ICharacter, target);
      }
      return;
    }

    return rangedAttackParams as IRangedAttackParams;
  }

  private sendNoAmmoEvent(character: ICharacter, target: ICharacter | INPC): void {
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

  private sendNotInRangeEvent(character: ICharacter, target: ICharacter | INPC): void {
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

  private sendSolidInTrajectoryEvent(character: ICharacter, target: ICharacter | INPC): void {
    this.socketMessaging.sendEventToUser<IBattleRangedAttackFailed>(
      character.channelId!,
      BattleSocketEvents.RangedAttackFailure,
      {
        targetId: target.id,
        type: target.type as EntityType,
        reason: "Ranged attack failed because there's a solid in ranged attack trajectory",
      }
    );
  }

  public sendRangedAttackEvent(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    ammo: IRangedAttackParams
  ): void {
    const character = (attacker.type === "Character" ? attacker : target) as ICharacter;
    this.socketMessaging.sendEventToUser<IRangedAttack>(character.channelId!, ItemSocketEvents.RangedAttack, {
      attackerId: attacker.id,
      targetId: target.id,
      direction: this.mathHelper.getDirectionFromPoint({ x: attacker.x, y: attacker.y }, { x: target.x, y: target.y }),
      type: attacker.type,
      ammoKey: ammo.key || undefined,
    });
  }

  private async getAmmoForRangedAttack(weapon: IItem, equipment: IEquipment): Promise<IRangedAttackParams | undefined> {
    let result: IRangedAttackParams | undefined;
    // Get ranged attack weapons (bow or spear)
    switch (weapon.subType) {
      case ItemSubType.Bow:
        // check if have enough arrows in inventory or equipment
        if (weapon.requiredAmmoKey !== BowsBlueprint.Arrow) {
          return result;
        }
        result = (await this.getRequiredAmmo(weapon.requiredAmmoKey, equipment)) as IRangedAttackParams;
        if (!_.isEmpty(result)) {
          result.maxRange = weapon.maxRange || 0;
        }
        break;

      case ItemSubType.Spear:
        result = { location: "hand", id: weapon.id, key: weapon.key, maxRange: weapon.maxRange || 0, equipment };
        break;
    }
    return result;
  }

  private async getRequiredAmmo(
    requiredAmmoKey: string,
    equipment: IEquipment
  ): Promise<Partial<IRangedAttackParams> | undefined> {
    // check if character has enough required ammo in inventory or equipment
    const accesory = await Item.findById(equipment.accessory);
    if (accesory && accesory.key === requiredAmmoKey) {
      return { location: ItemSlotType.Accessory, id: accesory._id, key: requiredAmmoKey, equipment };
    }

    if (!equipment.inventory) {
      return;
    }
    const backpack = equipment.inventory as unknown as IItem;
    const backpackContainer = await ItemContainer.findById(backpack.itemContainer);

    if (!backpackContainer) {
      throw new Error(`Backpack without item container. Item id ${backpack._id}`);
    }

    if (backpackContainer.emptySlotsQty === backpackContainer.slotQty) {
      return;
    }

    for (const item of await backpackContainer.items) {
      if (item.key === requiredAmmoKey) {
        return { location: ItemSlotType.Inventory, id: item._id, key: requiredAmmoKey, equipment };
      }
    }
  }

  /**
   * Consumes ammo from character's equipment accessory slot or inventory slot
   * and sends updateItemInventoryCharacter event
   */
  public async consumeAmmo(attackParams: IRangedAttackParams, character: ICharacter): Promise<void> {
    const backpack = attackParams.equipment!.inventory as unknown as IItem;
    const backpackContainer = (await ItemContainer.findById(backpack.itemContainer)) as IItemContainer;

    switch (attackParams.location) {
      case ItemSlotType.Accessory:
        attackParams.equipment!.accessory = undefined;
        await attackParams.equipment!.save();
        break;
      case ItemSlotType.Inventory:
        await this.equipmentEquip.removeItemFromInventory(attackParams.id.toString(), backpackContainer);
        break;
      case "hand":
        // Spear item is held in hand
        // Check which hand and remove the item
        const rightHandItem = attackParams.equipment!.rightHand
          ? await Item.findById(attackParams.equipment!.rightHand)
          : undefined;
        rightHandItem?.subType === ItemSubType.Spear
          ? (attackParams.equipment!.rightHand = undefined)
          : (attackParams.equipment!.leftHand = undefined);
        await attackParams.equipment!.save();
        break;
      default:
        throw new Error("Invalid ammo location");
    }
    await Item.deleteOne({ _id: attackParams.id });

    const equipmentSlots = await this.equipmentEquip.getEquipmentSlots(attackParams.equipment!._id);

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

  private async solidInTrajectory(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
    const origin = { x: ToGridX(attacker.x), y: ToGridY(attacker.y) };
    const destination = { x: ToGridX(target.x), y: ToGridY(target.y) };

    const crossedGridPoints = this.mathHelper.getCrossedGridPoints(origin, destination);

    for (const point of crossedGridPoints) {
      if (_.isEqual(point, origin) || _.isEqual(point, destination)) {
        continue;
      }
      const isSolid = await this.movementHelper.isSolid(attacker.scene, point.x, point.y, MapLayers.Character);
      if (isSolid) {
        return true;
      }
    }
    return false;
  }
}
