import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  RangedWeaponsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { BattleEventType, CharacterClass, FromGridX, FromGridY } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { BattleAttackTarget } from "../BattleAttackTarget";
import { BattleAttackTargetDeath } from "../BattleAttackTargetDeath";

jest.mock("../../../entityEffects/EntityEffectCycle.ts", () => ({
  EntityEffectCycle: jest.fn(),
}));

describe("BattleAttackTarget.spec.ts", () => {
  let battleAttackTarget: BattleAttackTarget;
  let battleAttackTargetDeath: BattleAttackTargetDeath;

  let testNPC: INPC;
  let testCharacter: ICharacter;

  beforeAll(() => {
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
    battleAttackTargetDeath = container.get<BattleAttackTargetDeath>(BattleAttackTargetDeath);
  });

  beforeEach(async () => {
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
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

  it("should NOT hit a target if attacker has melee attack type and target is out of range", async () => {
    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    const attacker = testCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridY(0);
    (await Character.findByIdAndUpdate(attacker._id, attacker).lean()) as ICharacter;

    const defender = testNPC;
    defender.x = FromGridX(5);
    defender.y = FromGridY(5);
    (await Character.findByIdAndUpdate(defender._id, defender).lean()) as ICharacter;

    await battleAttackTarget.checkRangeAndAttack(attacker, defender);

    // expect battleAttackTarget to not have been called

    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should hit a target if attacker has melee attack type and target is in range", async () => {
    await testNPC.populate("skills").execPopulate();
    await testCharacter.populate("skills").execPopulate();

    await battleAttackTarget.checkRangeAndAttack(testNPC, testCharacter);

    // expect battleAttackTarget to not have been called

    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("when battle event is a hit, it should decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

    // @ts-ignore
    const increaseSkillsOnBattle = jest.spyOn(battleAttackTarget.skillIncrease, "increaseSkillsOnBattle" as any);

    // @ts-ignore
    await battleAttackTarget.hitTarget(testCharacter, testNPC);

    expect(testNPC.health).toBeLessThan(testNPC.maxHealth);
    expect(increaseSkillsOnBattle).toHaveBeenCalled();
  });

  it("when battle event is a miss, it should not decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Miss);

    // @ts-ignore
    await battleAttackTarget.hitTarget(testCharacter, testNPC);

    expect(testNPC.health).toBe(testNPC.maxHealth);
  });

  it("NPC should clear its target, after killing a character", async () => {
    jest.useFakeTimers({
      advanceTimers: true,
    });

    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 200);

    // @ts-ignore
    const charDeath = jest.spyOn(battleAttackTarget.battleAttackTargetDeath, "handleDeathAfterHit");

    testCharacter.health = 1;
    (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

    // @ts-ignore
    await battleAttackTarget.hitTarget(testNPC, testCharacter);

    expect(charDeath).toHaveBeenCalled();

    expect(testNPC.targetCharacter).toBe(undefined);
  });

  describe("applyEntityEffectsIfApplicable", () => {
    let targetCharacter: ICharacter;
    let attackerCharacter: ICharacter;
    let testNPC: INPC;
    let battleAttackTarget: BattleAttackTarget;
    let bowItem: IItem;
    let fireSwordItem: IItem;
    let applyEntitySpy: jest.SpyInstance;
    let getWeaponSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;

    beforeAll(() => {
      battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
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

      bowItem = new Item({ ...bow });

      fireSwordItem = new Item({ ...fireSword });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it("should always call applyEntity when weapon has entityEffect and entity effect chance is 100", async () => {
      fireSwordItem.entityEffectChance = 100;
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(battleAttackTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await battleAttackTarget.applyEntity(attackerCharacter, testNPC, fireSwordItem);

      expect(applyEntityEffects).toBeCalledWith(attackerCharacter, testNPC);
    });

    it("should not call applyEntity when weapon has entityEffect and entity effect chance is 0", async () => {
      fireSwordItem.entityEffectChance = 0;
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(battleAttackTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await battleAttackTarget.applyEntity(attackerCharacter, testNPC, fireSwordItem);

      expect(applyEntityEffects).not.toHaveBeenCalled();
    });

    it("should not call applyEntity when weapon has  no entityEffect", async () => {
      fireSwordItem.entityEffectChance = 100;
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(battleAttackTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await battleAttackTarget.applyEntity(attackerCharacter, testNPC, bowItem);

      expect(applyEntityEffects).not.toHaveBeenCalled();
    });

    it("should call applyEntityEffects if npc has entityEffects", async () => {
      testNPC.entityEffects = ["a", "b"];
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffects = jest.spyOn(battleAttackTarget.entityEffectUse, "applyEntityEffects" as any).mockResolvedValue(undefined);

      // @ts-ignore
      await battleAttackTarget.applyEntityEffectsIfApplicable(testNPC, targetCharacter);

      expect(applyEntityEffects).toHaveBeenCalled();
    });

    it("should  call apply effects one time for the weapon", async () => {
      // @ts-ignore
      applyEntitySpy = jest.spyOn(battleAttackTarget, "applyEntity");
      // @ts-ignore
      getWeaponSpy = jest.spyOn(battleAttackTarget.characterWeapon, "getWeapon");
      // @ts-ignore
      findByIdSpy = jest.spyOn(Item, "findById");

      getWeaponSpy.mockResolvedValueOnce({ item: fireSwordItem });

      // @ts-ignore
      await battleAttackTarget.applyEntityEffectsCharacter(attackerCharacter, testNPC);

      expect(getWeaponSpy).toHaveBeenCalledWith(attackerCharacter);
      expect(applyEntitySpy).toHaveBeenCalledWith(testNPC, attackerCharacter, fireSwordItem);
      expect(applyEntitySpy).toBeCalledTimes(1);
    });

    it("should call applyEntityEffectsCharacter if the attacker is a Character", async () => {
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsCharacter = jest.spyOn(battleAttackTarget, "applyEntityEffectsCharacter").mockResolvedValue(undefined);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsIfApplicable = jest.spyOn(battleAttackTarget, "applyEntityEffectsIfApplicable").mockResolvedValue(undefined);

      // @ts-ignore
      await battleAttackTarget.hitTarget(attackerCharacter, testNPC);

      expect(applyEntityEffectsCharacter).toHaveBeenCalledWith(attackerCharacter, testNPC);
      expect(applyEntityEffectsIfApplicable).not.toHaveBeenCalled();
    });

    it("should call applyEntityEffectsIfApplicable if the attacker is a npc", async () => {
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsCharacter = jest.spyOn(battleAttackTarget, "applyEntityEffectsCharacter").mockResolvedValue(undefined);
      // @ts-ignore
      // prettier-ignore
      const applyEntityEffectsIfApplicable = jest.spyOn(battleAttackTarget, "applyEntityEffectsIfApplicable").mockResolvedValue(undefined);

      // @ts-ignore
      await battleAttackTarget.hitTarget(testNPC, targetCharacter);

      expect(applyEntityEffectsIfApplicable).toHaveBeenCalledWith(testNPC, targetCharacter);
      expect(applyEntityEffectsCharacter).not.toHaveBeenCalled();
    });
  });
});

describe("BattleAttackTarget.spec.ts | PVP battle", () => {
  let battleAttackTarget: BattleAttackTarget;

  let targetCharacter: ICharacter;
  let attackerCharacter: ICharacter;

  beforeAll(() => {
    battleAttackTarget = container.get<BattleAttackTarget>(BattleAttackTarget);
  });

  beforeEach(async () => {
    targetCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    attackerCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });

    attackerCharacter.x = FromGridX(0);
    attackerCharacter.y = FromGridX(0);
    attackerCharacter.class = CharacterClass.Hunter;

    (await Character.findByIdAndUpdate(attackerCharacter._id, attackerCharacter).lean()) as ICharacter;

    targetCharacter.x = FromGridX(1);
    targetCharacter.y = FromGridX(1);
    targetCharacter.class = CharacterClass.Warrior;

    (await Character.findByIdAndUpdate(targetCharacter._id, targetCharacter).lean()) as ICharacter;
  });

  it("should NOT hit a target if attacker has melee attack type and target is out of range", async () => {
    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    const attacker = attackerCharacter;
    attacker.x = FromGridX(0);
    attacker.y = FromGridY(0);

    (await Character.findByIdAndUpdate(attacker._id, attacker).lean()) as ICharacter;

    const defender = targetCharacter;
    defender.x = FromGridX(5);
    defender.y = FromGridY(5);

    (await Character.findByIdAndUpdate(defender._id, defender).lean()) as ICharacter;

    await battleAttackTarget.checkRangeAndAttack(attacker, defender);

    // expect battleAttackTarget to not have been called

    expect(hitTarget).not.toHaveBeenCalled();
  });

  it("should hit a target if attacker has melee attack type and target is in range", async () => {
    await targetCharacter.populate("skills").execPopulate();
    await attackerCharacter.populate("skills").execPopulate();

    // expect battleAttackTarget to have been called
    const hitTarget = jest.spyOn(battleAttackTarget, "hitTarget" as any);

    await battleAttackTarget.checkRangeAndAttack(targetCharacter, attackerCharacter);

    expect(hitTarget).toHaveBeenCalled();
  });

  it("when battle event is a hit, it should decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

    // @ts-ignore
    const increaseSkillsOnBattle = jest.spyOn(battleAttackTarget.skillIncrease, "increaseSkillsOnBattle" as any);

    // @ts-ignore
    await battleAttackTarget.hitTarget(attackerCharacter, targetCharacter);

    expect(targetCharacter.health).toBeLessThan(targetCharacter.maxHealth);
    expect(increaseSkillsOnBattle).toHaveBeenCalled();
  });

  it("when battle event is a miss, it should not decrease the target's health", async () => {
    // @ts-ignore
    jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Miss);

    // @ts-ignore
    await battleAttackTarget.hitTarget(attackerCharacter, targetCharacter);

    expect(targetCharacter.health).toBe(targetCharacter.maxHealth);
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
      jest.spyOn(battleAttackTarget.battleEvent, "calculateEvent" as any).mockImplementation(() => BattleEventType.Hit);
      // @ts-ignore
      jest.spyOn(battleAttackTarget.battleEvent, "calculateHitDamage" as any).mockImplementation(() => 50);

      // @ts-ignore
      const increaseSkillsOnBattle = jest.spyOn(battleAttackTarget.skillIncrease, "increaseMagicResistanceSP" as any);

      // @ts-ignore
      await battleAttackTarget.hitTarget(attackerCharacter, targetCharacter);

      expect(increaseSkillsOnBattle).toHaveBeenCalledWith(targetCharacter, 24);
    });
  });

  describe("Berserker BloodThirst", () => {
    let testCharacter: ICharacter;
    let inMemoryHashTable: InMemoryHashTable;

    beforeEach(async () => {
      inMemoryHashTable = container.get<InMemoryHashTable>(InMemoryHashTable);

      testCharacter = await unitTestHelper.createMockCharacter(null, {
        hasSkills: true,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it("should heal a berserker character when applyBerserkerBloodthirst is called", async () => {
      testCharacter.health = 90;
      testCharacter.class = CharacterClass.Berserker;
      (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

      // @ts-ignore
      await battleAttackTarget.applyBerserkerBloodthirst(testCharacter._id, 50);
      const updatedCharacter = (await Character.findById(testCharacter._id).lean()) as ICharacter;

      expect(updatedCharacter.health).toBe(95);
    });

    it("should return true when getBerserkerBloodthirstSpell is called with an existing spell", async () => {
      const characterId = Types.ObjectId();
      const namespace = `${NamespaceRedisControl.CharacterSpell}:${characterId}`;
      const key = SpellsBlueprint.BerserkerBloodthirst;
      await inMemoryHashTable.set(namespace, key, true);

      // @ts-ignore
      const spellActivated = await battleAttackTarget.getBerserkerBloodthirstSpell(characterId);
      expect(spellActivated).toBe(true);
    });

    it("should not heal a character if it is not a berserker when applyBerserkerBloodthirst is called", async () => {
      const initialHealth = testCharacter.health;
      testCharacter.class = CharacterClass.Druid;
      (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

      // @ts-ignore
      await battleAttackTarget.applyBerserkerBloodthirst(testCharacter._id, 50);
      const updatedCharacter = (await Character.findById(testCharacter._id).lean()) as ICharacter;
      expect(updatedCharacter.health).toEqual(initialHealth);
    });

    it("should full health a character if the healing would surpass the maximum health", async () => {
      testCharacter.maxHealth = 100;
      testCharacter.health = 90;
      testCharacter.class = CharacterClass.Berserker;
      (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

      // @ts-ignore
      await battleAttackTarget.applyBerserkerBloodthirst(testCharacter._id, 10000);
      const updatedCharacter = (await Character.findById(testCharacter._id).lean()) as ICharacter;

      expect(updatedCharacter.health).toEqual(testCharacter.maxHealth);
    });

    it("should not handle a berserker attack if the character is not a berserker", async () => {
      const initialHealth = testCharacter.health;
      (await Character.findByIdAndUpdate(testCharacter._id, { class: CharacterClass.Sorcerer }).lean()) as ICharacter;

      // @ts-ignore
      await battleAttackTarget.handleBerserkerAttack(testCharacter._id, 50);
      const updatedCharacter = (await Character.findById(testCharacter._id).lean()) as ICharacter;
      expect(updatedCharacter.health).toEqual(initialHealth);
    });
  });
});
