import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { QuestType } from "@rpg-engine/shared";
import { BattleAttackTargetDeath } from "../BattleAttackTargetDeath";

describe("BattleAttackTargetDeath.spec.ts", () => {
  let battleAttackTargetDeath: BattleAttackTargetDeath;

  let handleCharacterDeathSpy: jest.SpyInstance;
  let handleNPCDeathSpy: jest.SpyInstance;
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

    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
    testNPC = await unitTestHelper.createMockNPC(null, { hasSkills: true });
  });

  it("handleDeathAfterHit should handle character death when target is a character and not alive", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(handleCharacterDeathSpy).toHaveBeenCalled();
  });

  it("handleDeathAfterHit should handle NPC death when target is an NPC and not alive", async () => {
    testNPC.health = 0;
    await testNPC.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testCharacter, testNPC);

    expect(handleNPCDeathSpy).toHaveBeenCalled();
  });

  it("handleDeathAfterHit should not call any death handlers or apply entity effects if target is alive", async () => {
    testCharacter.health = 1;
    await testCharacter.save();

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(handleCharacterDeathSpy).not.toHaveBeenCalled();
    expect(handleNPCDeathSpy).not.toHaveBeenCalled();
  });

  it("upon death, if attacker is NPC it should clearTarget", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    // @ts-ignore
    const clearTargetSpy = jest.spyOn(battleAttackTargetDeath.npcTarget, "clearTarget");

    await battleAttackTargetDeath.handleDeathAfterHit(testNPC, testCharacter);

    expect(clearTargetSpy).toHaveBeenCalledWith(testNPC);
  });

  it("on NPC death, release XP and update quests if attacker is a character", async () => {
    testNPC.health = 0;
    await testNPC.save();

    // @ts-ignore
    const updateQuestsSpy = jest.spyOn(battleAttackTargetDeath.questSystem, "updateQuests");

    await battleAttackTargetDeath.handleDeathAfterHit(testCharacter, testNPC);

    expect(updateQuestsSpy).toHaveBeenCalledWith(QuestType.Kill, testCharacter, testNPC.key);
  });
});
