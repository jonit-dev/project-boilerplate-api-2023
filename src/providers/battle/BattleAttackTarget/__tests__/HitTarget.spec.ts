import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data";
import {
  RangedWeaponsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { BattleEventType, FromGridX } from "@rpg-engine/shared";

describe("HitTarget", () => {
  let hitTarget: HitTarget;
  let targetCharacter: ICharacter;
  let attackerCharacter: ICharacter;
  let testNPC: INPC;
  let bowItem: IItem;
  let fireSwordItem: IItem;
  let applyEntitySpy: jest.SpyInstance;
  let getWeaponSpy: jest.SpyInstance;
  let findByIdSpy: jest.SpyInstance;

  beforeAll(() => {
    hitTarget = container.get(HitTarget);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
    targetCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    attackerCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
      hasInventory: true,
    });

    const bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    const fireSword = itemsBlueprintIndex[SwordsBlueprint.FireSword];

    await testNPC.populate("skills").execPopulate();
    await targetCharacter.populate("skills").execPopulate();
    await attackerCharacter.populate("skills").execPopulate();

    bowItem = new Item({ ...bow });

    fireSwordItem = new Item({ ...fireSword });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("Core hit logic", () => {
    let testCharacter: ICharacter;

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasSkills: true,
      });

      testCharacter.x = FromGridX(0);
      testCharacter.y = FromGridX(0);
      (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

      testNPC.x = FromGridX(1);
      testNPC.y = FromGridX(1);
      (await NPC.findByIdAndUpdate(testNPC._id, testNPC).lean()) as INPC;
    });

    it("when battle event is a hit, it should decrease the target's health", async () => {
      jest
        // @ts-ignore
        .spyOn(hitTarget.battleEvent, "calculateEvent" as any)
        .mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

      const increaseSkillsOnBattle = jest.spyOn(
        // @ts-ignore
        hitTarget.skillIncrease,
        "increaseSkillsOnBattle" as any
      );

      // @ts-ignore
      await hitTarget.hit(testCharacter, testNPC);

      expect(testNPC.health).toBeLessThan(testNPC.maxHealth);
      expect(increaseSkillsOnBattle).toHaveBeenCalled();
    });

    it("when battle event is a miss, it should not decrease the target's health", async () => {
      jest
        // @ts-ignore
        .spyOn(hitTarget.battleEvent, "calculateEvent" as any)
        .mockImplementation(() => BattleEventType.Miss);

      // @ts-ignore
      await hitTarget.hit(testCharacter, testNPC);

      expect(testNPC.health).toBe(testNPC.maxHealth);
    });

    it("NPC should clear its target, after killing a character", async () => {
      jest.useFakeTimers({
        advanceTimers: true,
      });

      jest
        // @ts-ignore
        .spyOn(hitTarget.battleEvent, "calculateEvent" as any)
        .mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 200);

      // @ts-ignore
      const charDeath = jest.spyOn(hitTarget.battleAttackTargetDeath, "handleDeathAfterHit");

      testCharacter.health = 1;
      (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

      // @ts-ignore
      await hitTarget.hit(testNPC, testCharacter);

      expect(charDeath).toHaveBeenCalled();

      expect(testNPC.targetCharacter).toBe(undefined);
    });
  });

  describe("EntityEffects", () => {
    it("should always call applyEntity when weapon has entityEffect and entity effect chance is 100", async () => {
      fireSwordItem.entityEffectChance = 100;
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(hitTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await hitTarget.applyEntity(attackerCharacter, testNPC, fireSwordItem);

      expect(applyEntityEffects).toBeCalledWith(attackerCharacter, testNPC);
    });

    it("should not call applyEntity when weapon has entityEffect and entity effect chance is 0", async () => {
      fireSwordItem.entityEffectChance = 0;
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(hitTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await hitTarget.applyEntity(attackerCharacter, testNPC, fireSwordItem);

      expect(applyEntityEffects).not.toHaveBeenCalled();
    });

    it("should not call applyEntity when weapon has  no entityEffect", async () => {
      fireSwordItem.entityEffectChance = 100;
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(hitTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await hitTarget.applyEntity(attackerCharacter, testNPC, bowItem);

      expect(applyEntityEffects).not.toHaveBeenCalled();
    });

    it("should call applyEntityEffects if npc has entityEffects", async () => {
      testNPC.entityEffects = ["a", "b"];
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(hitTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await hitTarget.applyEntityEffectsIfApplicable(testNPC, targetCharacter);

      expect(applyEntityEffects).toHaveBeenCalled();
    });

    it("should  call apply effects one time for the weapon", async () => {
      // @ts-ignore
      applyEntitySpy = jest.spyOn(hitTarget, "applyEntity");
      // @ts-ignore
      getWeaponSpy = jest.spyOn(hitTarget.characterWeapon, "getWeapon");
      // @ts-ignore
      findByIdSpy = jest.spyOn(Item, "findById");

      getWeaponSpy.mockResolvedValueOnce({ item: fireSwordItem });

      // @ts-ignore
      await hitTarget.applyEntityEffectsCharacter(attackerCharacter, testNPC);

      expect(getWeaponSpy).toHaveBeenCalledWith(attackerCharacter);
      expect(applyEntitySpy).toHaveBeenCalledWith(testNPC, attackerCharacter, fireSwordItem);
      expect(applyEntitySpy).toBeCalledTimes(1);
    });

    it("should call applyEntityEffectsCharacter if the attacker is a Character", async () => {
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsCharacter = jest.spyOn(hitTarget, "applyEntityEffectsCharacter").mockResolvedValue(undefined);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsIfApplicable = jest.spyOn(hitTarget, "applyEntityEffectsIfApplicable").mockResolvedValue(undefined);

      await hitTarget.hit(attackerCharacter, testNPC);

      expect(applyEntityEffectsCharacter).toHaveBeenCalledWith(attackerCharacter, testNPC);
      expect(applyEntityEffectsIfApplicable).not.toHaveBeenCalled();
    });

    it("should call applyEntityEffectsIfApplicable if the attacker is a npc", async () => {
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsCharacter = jest.spyOn(hitTarget, "applyEntityEffectsCharacter").mockResolvedValue(undefined);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsIfApplicable = jest.spyOn(hitTarget, "applyEntityEffectsIfApplicable").mockResolvedValue(undefined);

      // @ts-ignore
      await hitTarget.hit(testNPC, targetCharacter);

      expect(applyEntityEffectsIfApplicable).toHaveBeenCalledWith(testNPC, targetCharacter);
      expect(applyEntityEffectsCharacter).not.toHaveBeenCalled();
    });
  });

  describe("magic staff ranged attack", () => {
    beforeEach(async () => {
      const characterEquipment = (await Equipment.findById(attackerCharacter.equipment).lean()) as IEquipment;
      const res = await unitTestHelper.createMockItemFromBlueprint(StaffsBlueprint.FireStaff);
      characterEquipment.rightHand = res.id;

      (await Equipment.findByIdAndUpdate(characterEquipment._id, characterEquipment).lean()) as IEquipment;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("when battle event is a hit, it should increase target magic resistance", async () => {
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(hitTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

      // @ts-ignore
      const increaseSkillsOnBattle = jest.spyOn(hitTarget.skillIncrease, "increaseMagicResistanceSP" as any);

      await hitTarget.hit(attackerCharacter, targetCharacter);

      expect(increaseSkillsOnBattle).toHaveBeenCalledWith(targetCharacter, 24);
    });
  });
});
