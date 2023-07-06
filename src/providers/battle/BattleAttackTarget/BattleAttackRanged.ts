import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemEquipment } from "@providers/character/characterItems/CharacterItemEquipment";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { blueprintManager } from "@providers/inversify/container";
import { AvailableBlueprints, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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

export interface IRangedAttackParams {
  location: string;
  id: Types.ObjectId;
  key: string;
  maxRange: number;
  equipment?: IEquipment;
  itemSubType?: ItemSubType;
  projectileAnimationKey?: AnimationEffectKeys;
}

const rangedWeaponsWithoutAmmo: string[] = [RangedWeaponsBlueprint.Shuriken];

@provide(BattleAttackRanged)
export class BattleAttackRanged {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private mathHelper: MathHelper,
    private movementHelper: MovementHelper,
    private equipmentSlots: EquipmentSlots,
    private animationEffect: AnimationEffect,
    private characterWeapon: CharacterWeapon,
    private characterItemEquipment: CharacterItemEquipment
  ) {}

  public sendNoAmmoEvent(
    character: ICharacter,
    target: { targetId: string; targetType: EntityType },
    magicAttack?: boolean
  ): void {
    let ammoType: string = "";
    let attackType: string = "";

    if (magicAttack) {
      ammoType = "mana";
      attackType = "magic";
    } else {
      ammoType = "ammo";
      attackType = "ranged";
    }

    this.socketMessaging.sendEventToUser<IBattleRangedAttackFailed>(
      character.channelId!,
      BattleSocketEvents.RangedAttackFailure,
      {
        targetId: target.targetId,
        type: target.targetType as EntityType,
        reason: `Oops! Not enough ${ammoType} for your ${attackType} attack!`,
      }
    );
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

  public async getAmmoForRangedAttack(
    character: ICharacter,
    equipment: IEquipment
  ): Promise<IRangedAttackParams | undefined> {
    const weapon = await this.characterWeapon.getWeapon(character);

    if (!weapon || !weapon.item) {
      return;
    }

    let result: IRangedAttackParams | undefined;
    // Get ranged attack weapons (bow or spear)
    if (weapon.item.rangeType === EntityAttackType.Ranged && weapon.item.subType !== ItemSubType.Staff) {
      if (rangedWeaponsWithoutAmmo.includes(weapon.item.baseKey)) {
        result = {
          location: weapon.location,
          id: weapon.item._id,
          key: weapon.item.baseKey,
          maxRange: weapon.item.maxRange || 0,
          itemSubType: weapon.item.subType as ItemSubType,
          equipment,
        };
        return result;
      }

      if (!weapon.item.requiredAmmoKeys || !weapon.item.requiredAmmoKeys.length) {
        return result;
      }

      result = (await this.getRequiredAmmo(weapon.item.requiredAmmoKeys, equipment)) as IRangedAttackParams;
      if (!_.isEmpty(result)) {
        result.maxRange = weapon.item.maxRange || 0;
      }
    }

    if (weapon.item.subType === "Staff") {
      const itemStaffOrWand = await blueprintManager.getBlueprint<any>("items", weapon.item.key as AvailableBlueprints);
      result = {
        location: weapon.location,
        id: weapon.item._id,
        key: itemStaffOrWand.projectileAnimationKey,
        maxRange: weapon.item.maxRange || 0,
        itemSubType: itemStaffOrWand.subType,
        equipment,
      };
    }

    if (weapon.item.subType === "Spear") {
      result = {
        location: weapon.location,
        id: weapon.item._id,
        key: weapon.item.key,
        maxRange: weapon.item.maxRange || 0,
        itemSubType: weapon.item.subType as ItemSubType,
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
    const accessory = await Item.findById(equipment.accessory).lean();

    for (const ammoKey of requiredAmmoKeys) {
      if (accessory && accessory.key === ammoKey) {
        return {
          location: ItemSlotType.Accessory,
          id: accessory._id,
          key: ammoKey,
          itemSubType: accessory.subType as ItemSubType,
          equipment,
        };
      }
    }
  }

  /**
   * Consumes ammo from character's equipment accessory slot or inventory slot
   * and sends updateItemInventoryCharacter event
   */
  public async consumeAmmo(attackParams: IRangedAttackParams, character: ICharacter): Promise<void> {
    const equipment = attackParams.equipment!;

    let equipmentSlot: string | undefined;
    switch (attackParams.location) {
      case ItemSlotType.Accessory:
        equipmentSlot = "accessory";
        break;
      case ItemSlotType.RightHand:
        equipmentSlot = "rightHand";
        break;
      case ItemSlotType.LeftHand:
        equipmentSlot = "leftHand";
        break;
      default:
        throw new Error("Invalid ammo location");
    }

    const success = await this.characterItemEquipment.decrementItemFromEquipment(
      attackParams.key,
      character,
      1,
      equipmentSlot
    );
    if (!success) {
      return;
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character._id, equipment._id);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: false,
    };

    this.equipmentEquip.updateItemInventoryCharacter(payloadUpdate, character);
  }

  public async consumeMana(
    attackParams: IRangedAttackParams,
    characterId: Types.ObjectId,
    target: { targetId: string; targetType: EntityType }
  ): Promise<boolean> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const itemMagicRanged = (await Item.findById(attackParams.id).lean()) as IItem;

    if (!itemMagicRanged || !character) {
      return false;
    }

    if (itemMagicRanged.attack && attackParams?.itemSubType === ItemSubType.Staff) {
      const manaCondition = this.haveManaForAttack(character.mana, itemMagicRanged.attack);

      if (manaCondition.haveMana) {
        await Character.updateOne(
          {
            _id: character._id,
          },
          {
            $set: {
              mana: manaCondition.newMana,
            },
          }
        );

        const payload: ICharacterAttributeChanged = {
          targetId: character._id,
          mana: manaCondition.newMana,
        };

        this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);

        return manaCondition.haveMana;
      } else {
        const magicAttack = true;
        this.sendNoAmmoEvent(character, target, magicAttack);

        return manaCondition.haveMana;
      }
    }

    return false;
  }

  private haveManaForAttack(characterMana: number, itemConsumeMana: number): { haveMana: boolean; newMana: number } {
    const newMana = characterMana - this.getRequiredManaForAttack(itemConsumeMana);
    if (characterMana < 1 || newMana <= 0) {
      return { haveMana: false, newMana: 0 };
    }

    if (characterMana > 1 && newMana > 0) {
      return { haveMana: true, newMana };
    }

    return { haveMana: false, newMana: 0 };
  }

  public async isSolidInRangedTrajectory(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC | IItem
  ): Promise<boolean> {
    if (typeof target.x === "undefined" || typeof target.y === "undefined") {
      return false;
    }
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

  private getRequiredManaForAttack(weapon: number): number {
    return Math.round(weapon! / 6);
  }
}
