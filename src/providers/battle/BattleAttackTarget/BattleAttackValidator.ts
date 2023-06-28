import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { EntityType, IItem, ItemSlotType, ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BattleAttackRanged, IRangedAttackParams } from "./BattleAttackRanged";

@provide(BattleAttackValidator)
export class BattleAttackValidator {
  constructor(
    private battleRangedAttack: BattleAttackRanged,
    private movementHelper: MovementHelper,
    private newRelic: NewRelic,
    private characterInventory: CharacterInventory,
    private socketMessaging: SocketMessaging
  ) {}

  public async validateAttack(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC
  ): Promise<IRangedAttackParams | undefined> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "BattleAttackValidator.validateAttack",
      async () => {
        let rangedAttackParams: Partial<IRangedAttackParams> | undefined;

        if (attacker.type === "NPC") {
          const npc = attacker as INPC;
          if (!npc.maxRangeAttack) {
            throw new Error("NPC attempted ranged attack without specifying maxRangeAttack field");
          }
          rangedAttackParams = { maxRange: npc.maxRangeAttack };
        } else {
          const character = attacker as ICharacter;
          rangedAttackParams = await this.getCharacterRangedAttackParams(character, target);
          if (!rangedAttackParams) return;
        }

        if (!this.isAttackInRange(attacker, target, rangedAttackParams.maxRange!)) {
          if (attacker.type === "Character") {
            this.sendNotInRangeEvent(attacker as ICharacter, target);
          }
          return;
        }

        const solidInTrajectory = await this.battleRangedAttack.isSolidInRangedTrajectory(attacker, target);
        if (solidInTrajectory) {
          if (attacker.type === "Character") {
            this.sendSolidInTrajectoryEvent(attacker as ICharacter, target);
          }
          return;
        }

        return rangedAttackParams as IRangedAttackParams;
      }
    );
  }

  private async getCharacterRangedAttackParams(
    character: ICharacter,
    target: ICharacter | INPC
  ): Promise<Partial<IRangedAttackParams> | undefined> {
    const equipment = (await Equipment.findById(character.equipment).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    })) as IEquipment;

    const inventory = (await this.characterInventory.getInventory(character)) as unknown as IItem;

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you don't have an inventory");
      return;
    }

    equipment.inventory = inventory;

    if (!equipment) {
      throw new Error(`equipment not found for character ${character.id}`);
    }

    const rangedAttackParams = await this.battleRangedAttack.getAmmoForRangedAttack(character, equipment);

    if (!rangedAttackParams) {
      const magicAttack = false;
      this.battleRangedAttack.sendNoAmmoEvent(
        character,
        { targetId: target.id, targetType: target.type as EntityType },
        magicAttack
      );
      return;
    }

    return rangedAttackParams;
  }

  private isAttackInRange(attacker: ICharacter | INPC, target: ICharacter | INPC, maxRange: number): boolean {
    return this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, maxRange);
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
    if (!equipment) {
      throw new Error(`Equipment not found for character ${characterId}`);
    }

    const rightItemStaff = equipment.rightHand as IItem;
    const leftItemStaff = equipment.leftHand as IItem;

    const attackParams: IRangedAttackParams[] = [];

    if (rightItemStaff?.subType === ItemSubType.Staff) {
      attackParams.push({
        location: ItemSlotType.RightHand,
        id: rightItemStaff._id,
        key: rightItemStaff.key,
        maxRange: rightItemStaff.maxRange as number,
        itemSubType: rightItemStaff.subType as ItemSubType,
      });
    }

    if (leftItemStaff?.subType === ItemSubType.Staff) {
      attackParams.push({
        location: ItemSlotType.LeftHand,
        id: leftItemStaff._id,
        key: leftItemStaff.key,
        maxRange: leftItemStaff.maxRange as number,
        itemSubType: leftItemStaff.subType as ItemSubType,
      });
    }

    let manaConsumed = false;
    for (const attackParam of attackParams) {
      manaConsumed = await this.battleRangedAttack.consumeMana(attackParam, character._id, target);
      if (manaConsumed) break;
    }

    return manaConsumed;
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
