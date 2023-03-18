import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { EntityType, IItem, ItemSlotType, ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BattleAttackRanged, IRangedAttackParams } from "./BattleAttackRanged";

@provide(BattleAttackValidator)
export class BattleAttackValidator {
  constructor(private battleRangedAttack: BattleAttackRanged, private movementHelper: MovementHelper) {}

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

      rangedAttackParams = await this.battleRangedAttack.getAmmoForRangedAttack(character, equipment);

      if (!rangedAttackParams) {
        const magicAttack = false;
        this.battleRangedAttack.sendNoAmmoEvent(
          character,
          { targetId: target.id, targetType: target.type as EntityType },
          magicAttack
        );
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
    const solidInTrajectory = await this.battleRangedAttack.isSolidInRangedTrajectory(attacker, target);
    if (solidInTrajectory) {
      if (attacker.type === "Character") {
        this.sendSolidInTrajectoryEvent(attacker as ICharacter, target);
      }
      return;
    }

    return rangedAttackParams as IRangedAttackParams;
  }

  public async validateMagicAttack(
    characterId: Types.ObjectId,
    target: { targetId: string; targetType: EntityType }
  ): Promise<boolean> {
    const character = (await Character.findById(characterId)
      .populate({
        path: "skills",
        model: "Skill",
      })
      .lean()
      .populate({
        path: "equipment",
        model: "Equipment",

        populate: {
          path: "rightHand leftHand",
          model: "Item",
        },
      })
      .lean()) as ICharacter;

    if (!character) {
      throw new Error(`Character not found for id ${characterId}`);
    }

    const equipment = character.equipment as IEquipment;
    const equipmentId = equipment._id;

    if (!equipment) {
      throw new Error(`Equipment not found for id ${equipmentId}`);
    }

    const rightItemStaff = (await Item.findById(equipment?.rightHand).lean()) as IItem;
    const leftItemStaff = (await Item.findById(equipment?.leftHand).lean()) as IItem;

    const rightAttackParams: IRangedAttackParams = {
      location: ItemSlotType.RightHand,
      id: rightItemStaff?._id,
      key: rightItemStaff?.key,
      maxRange: rightItemStaff?.maxRange as number,
      itemSubType: rightItemStaff?.subType as ItemSubType,
    };

    const leftAttackParams: IRangedAttackParams = {
      location: ItemSlotType.LeftHand,
      id: leftItemStaff?._id,
      key: leftItemStaff?.key,
      maxRange: leftItemStaff?.maxRange as number,
      itemSubType: leftItemStaff?.subType as ItemSubType,
    };

    let manaConsumed = false;

    if (rightAttackParams?.itemSubType === ItemSubType.Staff && leftAttackParams?.itemSubType === ItemSubType.Staff) {
      manaConsumed = await this.battleRangedAttack.consumeMana(rightAttackParams, character._id, target);
      manaConsumed ? await this.battleRangedAttack.consumeMana(leftAttackParams, character._id, target) : manaConsumed;

      return manaConsumed;
    } else if (
      rightAttackParams?.itemSubType === ItemSubType.Staff &&
      leftAttackParams?.itemSubType !== ItemSubType.Staff
    ) {
      manaConsumed = await this.battleRangedAttack.consumeMana(rightAttackParams, character._id, target);
      return manaConsumed;
    } else if (
      leftAttackParams?.itemSubType === ItemSubType.Staff &&
      rightAttackParams?.itemSubType !== ItemSubType.Staff
    ) {
      manaConsumed = await this.battleRangedAttack.consumeMana(leftAttackParams, character._id, target);
      return manaConsumed;
    } else {
      return manaConsumed;
    }
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
}
