import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { MathHelper } from "@providers/math/MathHelper";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

import {
  AnimationEffectKeys,
  BattleSocketEvents,
  CharacterSocketEvents,
  IBattleRangedAttackFailed,
  ICharacterAttributeChanged,
  IEquipmentAndInventoryUpdatePayload,
  ItemSlotType,
  ItemSubType,
  MapLayers,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";

interface IRangedAttackParams {
  location: string;
  id: Types.ObjectId;
  key: string;
  maxRange: number;
  equipment?: IEquipment;
  itemSubType?: ItemSubType;
}

@provide(BattleRangedAttack)
export class BattleRangedAttack {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private mathHelper: MathHelper,
    private movementHelper: MovementHelper,
    private equipmentSlots: EquipmentSlots,
    private animationEffect: AnimationEffect
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

      rangedAttackParams = await this.getAmmoForRangedAttack(character, equipment);

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
        reason: "Oops! Not enough ammo for your ranged attack!",
      }
    );
  }

  private sendNotInRangeEvent(character: ICharacter, target: ICharacter | INPC): void {
    // this.socketMessaging.sendEventToUser<IBattleRangedAttackFailed>(
    //   character.channelId!,
    //   BattleSocketEvents.RangedAttackFailure,
    //   {
    //     targetId: target.id,
    //     type: target.type as EntityType,
    //     reason: "Ranged attack failed because target distance exceeds weapon max range",
    //   }
    // );
  }

  private sendSolidInTrajectoryEvent(character: ICharacter, target: ICharacter | INPC): void {
    // this.socketMessaging.sendEventToUser<IBattleRangedAttackFailed>(
    //   character.channelId!,
    //   BattleSocketEvents.RangedAttackFailure,
    //   {
    //     targetId: target.id,
    //     type: target.type as EntityType,
    //     reason: "Ranged attack failed because there's a solid in ranged attack trajectory",
    //   }
    // );
  }

  public async sendRangedAttackEvent(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    ammo: IRangedAttackParams
  ): Promise<void> {
    switch (attacker.type) {
      case "Character":
        const character = attacker as ICharacter;
        await this.animationEffect.sendProjectileAnimationEventToCharacter(
          character,
          attacker.id,
          target.id,
          ammo.key || AnimationEffectKeys.Arrow
        );
        break;

      case "NPC":
        const npc = attacker as INPC;
        await this.animationEffect.sendProjectileAnimationEventToNPC(
          npc,
          attacker.id,
          target.id,
          npc.ammoKey || AnimationEffectKeys.Arrow
        );
        break;
    }
  }

  private async getAmmoForRangedAttack(
    character: ICharacter,
    equipment: IEquipment
  ): Promise<IRangedAttackParams | undefined> {
    const weapon = (await character.weapon) as IItem;

    let result: IRangedAttackParams | undefined;
    // Get ranged attack weapons (bow or spear)
    if (weapon.rangeType === EntityAttackType.Ranged) {
      if (weapon.subType === ItemSubType.Magic || weapon.subType === ItemSubType.Staff) {
        if (character.mana < this.getRequiredManaForAttack(weapon)) {
          return result;
        }

        const blueprint = itemsBlueprintIndex[weapon.key];
        return {
          location: ItemSlotType.LeftHand,
          id: weapon.id,
          itemSubType: weapon.subType,
          key: blueprint?.projectileAnimationKey,
          maxRange: weapon.maxRange || 0,
          equipment,
        };
      }

      if (!weapon.requiredAmmoKeys || !weapon.requiredAmmoKeys.length) {
        return result;
      }

      result = (await this.getRequiredAmmo(weapon.requiredAmmoKeys, equipment)) as IRangedAttackParams;
      if (!_.isEmpty(result)) {
        result.maxRange = weapon.maxRange || 0;
      }
    }

    if (weapon.subType === "Spear") {
      result = {
        location: ItemSlotType.LeftHand,
        id: weapon.id,
        key: weapon.key,
        maxRange: weapon.maxRange || 0,
        equipment,
      };
    }

    return result;
  }

  // This function returns the required ammo data if the required ammo is in the equipment's accessory slot
  private async getRequiredAmmo(
    requiredAmmoKeys: string[],
    equipment: IEquipment
  ): Promise<Partial<IRangedAttackParams> | undefined> {
    // check if character has enough required ammo in accessory slot
    const accessory = await Item.findById(equipment.accessory).lean({ virtuals: true, defaults: true });

    for (const ammoKey of requiredAmmoKeys) {
      if (accessory && accessory.key === ammoKey) {
        return { location: ItemSlotType.Accessory, id: accessory._id, key: ammoKey, equipment };
      }
    }
  }

  /**
   * Consumes ammo from character's equipment accessory slot or inventory slot
   * and sends updateItemInventoryCharacter event
   */
  public async consumeAmmo(attackParams: IRangedAttackParams, character: ICharacter): Promise<void> {
    const equipment = attackParams.equipment!;

    let deleteItem = true;
    let consumedMana = false;

    switch (attackParams.location) {
      case ItemSlotType.Accessory:
        const accessory = (await Item.findById(equipment.accessory)) as unknown as IItem;

        if (!accessory) {
          return;
        }

        // if item stackQty > 1, just decrease stackQty by 1
        if (accessory.stackQty && accessory.stackQty > 1) {
          deleteItem = false;

          accessory.stackQty -= 1;
          await accessory.save();
        } else {
          // if item stackQty === 1, remove item from equipment accessory slot
          equipment.accessory = undefined;
          await equipment.save();
        }

        break;
      case ItemSlotType.RightHand:
      case ItemSlotType.LeftHand:
        const item = equipment.rightHand ?? equipment.leftHand;
        const handItem = await Item.findById(item);

        if (handItem?.subType === ItemSubType.Magic || handItem?.subType === ItemSubType.Staff) {
          deleteItem = false;
          consumedMana = true;
          character.mana = character.mana - this.getRequiredManaForAttack(handItem);
          await character.save();
        } else if (handItem?.subType === ItemSubType.Spear) {
          if (equipment.rightHand) {
            equipment.rightHand = undefined;
          } else {
            equipment.leftHand = undefined;
          }
          await equipment.save();
        }

        break;
      default:
        throw new Error("Invalid ammo location");
    }

    if (deleteItem) {
      await Item.deleteOne({ _id: attackParams.id });
    }

    if (!consumedMana) {
      const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        equipment: equipmentSlots,
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: false,
      };

      this.equipmentEquip.updateItemInventoryCharacter(payloadUpdate, character);
    } else {
      const payload: ICharacterAttributeChanged = {
        targetId: character._id,
        mana: character.mana,
      };

      this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    }
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

  private getRequiredManaForAttack(weapon: IItem): number {
    return Math.round(weapon.attack! / 6);
  }
}
