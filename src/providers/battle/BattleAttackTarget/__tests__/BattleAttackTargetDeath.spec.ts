import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { QuestType } from "@rpg-engine/shared";
import { BattleAttackTargetDeath } from "../BattleAttackTargetDeath";

describe("BattleAttackTargetDeath.spec.ts", () => {
  let battleAttackTargetDeath: BattleAttackTargetDeath;

  let handleCharacterDeathSpy: jest.SpyInstance;
  let handleNPCDeathSpy: jest.SpyInstance;
  let applyEntityEffectsIfApplicableSpy: jest.SpyInstance;

  let testCharacter: ICharacter;
  let testNPC: INPC;

  beforeEach(async () => {
    battleAttackTargetDeath = container.get<BattleAttackTargetDeath>(BattleAttackTargetDeath);

    jest.clearAllMocks();

    // Spy on relevant methods
    // @ts-ignore
    handleCharacterDeathSpy = jest.spyOn(battleAttackTargetDeath, "handleCharacterDeath");
    // @ts-ignore
    handleNPCDeathSpy = jest.spyOn(battleAttackTargetDeath, "handleNPCDeath");
    // @ts-ignore
    applyEntityEffectsIfApplicableSpy = jest.spyOn(battleAttackTargetDeath, "applyEntityEffectsIfApplicable");

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
  });

  test("handleDeathAfterHit should handle character death when target is a character and not alive", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(handleCharacterDeathSpy).toHaveBeenCalled();
  });

  test("handleDeathAfterHit should handle NPC death when target is an NPC and not alive", async () => {
    testNPC.health = 0;
    await testNPC.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testCharacter, testNPC);

    expect(handleNPCDeathSpy).toHaveBeenCalled();
  });

  test("handleDeathAfterHit should apply entity effects if attacker is an NPC and target is not alive", async () => {
    testCharacter.health = 0;
    // @ts-ignore
    testNPC.entityEffects = [{ id: 1, duration: 10 }];
    await testCharacter.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(applyEntityEffectsIfApplicableSpy).toHaveBeenCalled();
  });

  test("handleDeathAfterHit should not call any death handlers or apply entity effects if target is alive", async () => {
    testCharacter.health = 1;
    await testCharacter.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(handleCharacterDeathSpy).not.toHaveBeenCalled();
    expect(handleNPCDeathSpy).not.toHaveBeenCalled();
    expect(applyEntityEffectsIfApplicableSpy).not.toHaveBeenCalled();
  });

  test("upon death, if attacker is NPC it should clearTarget", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    // @ts-ignore
    const clearTargetSpy = jest.spyOn(battleAttackTargetDeath.npcTarget, "clearTarget");

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(clearTargetSpy).toHaveBeenCalledWith(testNPC);
  });

  test("on NPC death, release XP and update quests if attacker is a character", async () => {
    testNPC.health = 0;
    await testNPC.save();

    // @ts-ignore
    const releaseXPSpy = jest.spyOn(battleAttackTargetDeath.skillIncrease, "releaseXP");
    // @ts-ignore
    const updateQuestsSpy = jest.spyOn(battleAttackTargetDeath.questSystem, "updateQuests");

    await battleAttackTargetDeath.handleDeathAfterHit(testCharacter, testNPC);

    expect(releaseXPSpy).toHaveBeenCalledWith(testNPC);
    expect(updateQuestsSpy).toHaveBeenCalledWith(QuestType.Kill, testCharacter, testNPC.key);
  });
});
