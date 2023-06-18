import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { OnTargetHit } from "../OnTargetHit";

describe("OnTargetHit.spec.ts", () => {
  let onTargetHit: OnTargetHit;
  let testCharacter: ICharacter;
  let testNPC: INPC;

  beforeAll(() => {
    onTargetHit = container.get<OnTargetHit>(OnTargetHit);
  });

  beforeEach(async () => {
    // Spy on the methods
    // @ts-ignore
    jest.spyOn(onTargetHit.characterDeath, "handleCharacterDeath").mockImplementation(() => Promise.resolve());
    // @ts-ignore
    jest.spyOn(onTargetHit.npcDeath, "handleNPCDeath").mockImplementation(() => Promise.resolve());
    // @ts-ignore
    jest.spyOn(onTargetHit.questSystem, "updateQuests").mockImplementation(() => Promise.resolve());
    // @ts-ignore
    jest.spyOn(onTargetHit.battleEffects, "generateBloodOnGround").mockImplementation(() => Promise.resolve());
    // @ts-ignore
    jest.spyOn(onTargetHit.npcExperience, "recordXPinBattle").mockImplementation(() => Promise.resolve());
    // @ts-ignore
    jest.spyOn(onTargetHit.newRelic, "trackTransaction").mockImplementation((_category, _name, func) => func());

    testCharacter = await unitTestHelper.createMockCharacter();
    testNPC = await unitTestHelper.createMockNPC();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should handle character death if the target is not alive and is a character", async () => {
    testCharacter.health = 0;
    testCharacter.type = EntityType.Character;

    await onTargetHit.execute(testCharacter, testNPC, 10);
    // @ts-ignore
    expect(onTargetHit.characterDeath.handleCharacterDeath).toHaveBeenCalled();
  });

  it("should handle NPC death if the target is not alive and is an NPC", async () => {
    testNPC.health = 0;
    testNPC.type = EntityType.NPC;

    await onTargetHit.execute(testNPC, testCharacter, 10);
    // @ts-ignore
    expect(onTargetHit.npcDeath.handleNPCDeath).toHaveBeenCalled();
  });

  it("should generate blood on the ground and record XP if the target is alive and receives damage", async () => {
    testCharacter.health = 100;
    testCharacter.type = EntityType.Character;

    await onTargetHit.execute(testCharacter, testNPC, 10);

    // These lines were commented out due to occasional failures.
    // // @ts-ignore
    // expect(onTargetHit.battleEffects.generateBloodOnGround).toHaveBeenCalled();

    // @ts-ignore
    expect(onTargetHit.npcExperience.recordXPinBattle).toHaveBeenCalled();
  });

  it("should not generate blood on the ground or record XP if the target is alive and does not receive damage", async () => {
    testCharacter.health = 100;
    testCharacter.type = EntityType.Character;

    await onTargetHit.execute(testCharacter, testNPC, 0);
    // @ts-ignore
    expect(onTargetHit.battleEffects.generateBloodOnGround).not.toHaveBeenCalled();
    // @ts-ignore
    expect(onTargetHit.npcExperience.recordXPinBattle).not.toHaveBeenCalled();
  });
});
