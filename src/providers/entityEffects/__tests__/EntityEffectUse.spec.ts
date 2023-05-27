import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { RangedWeaponsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { EntityAttackType } from "@rpg-engine/shared";
import _ from "lodash";
import { EntityEffectCycle } from "../EntityEffectCycle";
import { EntityEffectUse } from "../EntityEffectUse";
import { entityEffectsBlueprintsIndex } from "../data";
import { IEntityEffect } from "../data/blueprints/entityEffect";
import { EntityEffectBlueprint } from "../data/types/entityEffectBlueprintTypes";

jest.mock("../EntityEffectCycle.ts", () => ({
  EntityEffectCycle: jest.fn(),
}));

describe("EntityEffectUse.ts", () => {
  let entityEffectUse: EntityEffectUse;
  let testAttacker: INPC;
  let testTargetNPC: INPC;
  let testTarget: ICharacter;
  let poisonEntityEffect: IEntityEffect;
  let entityEffectSpy;
  let testCharacter: ICharacter;
  let poisonSwordItem: IItem;
  let bowItem: IItem;
  let poisonArrowItem: IItem;
  let getWeaponSpy: jest.SpyInstance;
  let findByIdEquipmentSpy: jest.SpyInstance;
  let findByIdAccessorySpy: jest.SpyInstance;

  beforeAll(() => {
    entityEffectUse = container.get<EntityEffectUse>(EntityEffectUse);
  });
  beforeEach(async () => {
    testAttacker = await unitTestHelper.createMockNPC(null, {});

    poisonEntityEffect = entityEffectsBlueprintsIndex[EntityEffectBlueprint.Poison];

    testAttacker.entityEffects = [poisonEntityEffect.key];

    testTarget = await unitTestHelper.createMockCharacter(null, {});

    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
      hasInventory: true,
    });

    const poisonSword = itemsBlueprintIndex[SwordsBlueprint.PoisonSword];
    poisonSwordItem = new Item({ ...poisonSword });
    await poisonSwordItem.save();

    const bow = itemsBlueprintIndex[RangedWeaponsBlueprint.Bow];
    bowItem = new Item({ ...bow });
    await bowItem.save();
    const poisonArrow = itemsBlueprintIndex[RangedWeaponsBlueprint.PoisonArrow];
    poisonArrowItem = new Item({ ...poisonArrow });
    await poisonArrowItem.save();

    // @ts-ignore
    entityEffectSpy = jest.spyOn(entityEffectUse, "startEntityEffectCycle");

    testTargetNPC = await unitTestHelper.createMockNPC(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("creates a testAttacker with entityEffects (poison)", () => {
    expect(testAttacker.entityEffects).toBeDefined();
  });

  it("should call applyEntityEffect if runeEffect is provided", async () => {
    // @ts-ignore
    const runeEffectSpy = jest.spyOn(entityEffectUse, "applyEntityEffect");
    // @ts-ignore
    const startEntityEffectCycleSpy = jest.spyOn(entityEffectUse, "startEntityEffectCycle");
    await entityEffectUse.applyEntityEffects(testTarget, testAttacker, poisonEntityEffect);
    expect(runeEffectSpy).toHaveBeenCalledTimes(1);
    expect(startEntityEffectCycleSpy).toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if there are no EntityEffect", async () => {
    testAttacker.entityEffects = [];
    await testAttacker.save();
    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);
    expect(EntityEffectCycle).not.toHaveBeenCalled();
  });

  it("should call EntityEffectCycle if there are EntityEffect and probability is maximum", async () => {
    poisonEntityEffect.probability = 100;

    const randomMock = jest.spyOn(_, "random");
    // make it always return 0
    randomMock.mockReturnValue(0);

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(entityEffectSpy).toHaveBeenCalledTimes(1);
  });

  it("should not call EntityEffectCycle if there are EntityEffect and probability is minimum", async () => {
    poisonEntityEffect.probability = 0;

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(entityEffectSpy).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if character already has an effect applied", async () => {
    testTarget.appliedEntityEffects = [poisonEntityEffect.key];
    await testTarget.save();

    await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

    expect(entityEffectSpy).not.toHaveBeenCalled();
  });

  it("should not call EntityEffectCycle if the target is not a character or NPC", async () => {
    const invalidTarget = {};
    await entityEffectUse.applyEntityEffects(invalidTarget as any, testAttacker);
    expect(entityEffectSpy).not.toHaveBeenCalled();
  });

  it("should clear all entity effects when clearAllEntityEffects is called", async () => {
    testTarget.appliedEntityEffects = [poisonEntityEffect.key];
    await testTarget.save();

    await entityEffectUse.clearAllEntityEffects(testTarget);

    // Refresh testTarget from the database
    const refreshedTestTarget = await Character.findById(testTarget._id);

    expect(refreshedTestTarget?.appliedEntityEffects).toHaveLength(0);
  });

  it("should call applicable entity effects for a character with a weapon effect", async () => {
    poisonEntityEffect.probability = 100;
    // @ts-ignore
    getWeaponSpy = jest.spyOn(entityEffectUse.characterWeapon, "getWeapon");
    getWeaponSpy.mockResolvedValueOnce({ item: poisonSwordItem });

    await entityEffectUse.applyEntityEffects(testAttacker, testCharacter);
    expect(entityEffectSpy).toHaveBeenCalledTimes(1);
  });

  it("should not call entity effects for a character without a weapon effect", async () => {
    poisonEntityEffect.probability = 100;
    // @ts-ignore
    getWeaponSpy = jest.spyOn(entityEffectUse.characterWeapon, "getWeapon");
    getWeaponSpy.mockResolvedValueOnce({ item: bowItem });

    await entityEffectUse.applyEntityEffects(testAttacker, testCharacter);
    expect(entityEffectSpy).not.toBeCalled();
  });

  it("should call entity effects for a character with an accessory effect", async () => {
    poisonEntityEffect.probability = 100;
    // @ts-ignore
    getWeaponSpy = jest.spyOn(entityEffectUse.characterWeapon, "getWeapon");
    getWeaponSpy.mockResolvedValueOnce({ item: bowItem });
    findByIdEquipmentSpy = jest.spyOn(Equipment, "findById");
    findByIdAccessorySpy = jest.spyOn(Item, "findById");
    findByIdAccessorySpy.mockResolvedValueOnce(poisonArrowItem);

    await entityEffectUse.applyEntityEffects(testAttacker, testCharacter);
    expect(entityEffectSpy).toHaveBeenCalledTimes(1);
  });

  it("should call Character.updateOne if target type is Character", async () => {
    const characterUpdateSpy = jest.spyOn(Character, "updateOne");
    testTarget.type = "Character";
    await entityEffectUse.applyEntityEffects(testTarget, testAttacker, poisonEntityEffect);
    expect(characterUpdateSpy).toHaveBeenCalledTimes(1);
    expect(characterUpdateSpy).toHaveBeenCalledWith(
      { _id: testTarget.id },
      { $set: { appliedEntityEffects: testTarget.appliedEntityEffects } }
    );
  });

  it("should call NPC.updateOne if target type is NPC", async () => {
    const npcUpdateSpy = jest.spyOn(NPC, "updateOne");
    await entityEffectUse.applyEntityEffects(testTargetNPC, testAttacker, poisonEntityEffect);
    expect(npcUpdateSpy).toHaveBeenCalledTimes(1);
    expect(npcUpdateSpy).toHaveBeenCalledWith(
      { _id: testTargetNPC.id },
      { $set: { appliedEntityEffects: testTargetNPC.appliedEntityEffects } }
    );
  });

  describe("Attack types", () => {
    beforeEach(async () => {
      poisonEntityEffect.probability = 100;

      // clear
      testAttacker.entityEffects = [];
      testAttacker.attackType = EntityAttackType.Melee;
      await testAttacker.save();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    //! Flaky test
    it("should not call applyEntityEffects when attacker attack type Melee and no entity effects", async () => {
      testAttacker.entityEffects = [];
      testAttacker.attackType = EntityAttackType.Melee;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).not.toHaveBeenCalled();
    });
    it("should not call applyEntityEffects when attacker attack type is Ranged and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.Ranged;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).not.toHaveBeenCalled();
    });
    it("should call applyEntityEffects when attacker attack type is Melee and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.Melee;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).toHaveBeenCalled();
    });
    it("should call applyEntityEffects when attacker attack type is MeleeRanged and entity effects attack type Melee", async () => {
      testAttacker.entityEffects = [EntityEffectBlueprint.Poison];
      testAttacker.attackType = EntityAttackType.MeleeRanged;
      await testAttacker.save();

      await entityEffectUse.applyEntityEffects(testTarget, testAttacker);

      expect(entityEffectSpy).toHaveBeenCalled();
    });
  });
});
