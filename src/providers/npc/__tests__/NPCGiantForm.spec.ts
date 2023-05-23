import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NPCAlignment } from "@rpg-engine/shared";
import { NPCGiantForm } from "../NPCGiantForm";

describe("NPCGiantForm", () => {
  let npc: INPC;
  let npcGiantForm: NPCGiantForm;

  beforeEach(async () => {
    npc = await unitTestHelper.createMockNPC(null, {
      hasSkills: true,
    });
    npcGiantForm = container.get<NPCGiantForm>(NPCGiantForm);
    NPC.updateOne = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should reset NPC to normal form if it is in giant form", async () => {
    npc.isGiantForm = true;
    // @ts-expect-error
    npcGiantForm.restoreNPCStatsToNormalForm = jest.fn();

    await npcGiantForm.resetNPCToNormalForm(npc);

    expect(NPC.updateOne).toHaveBeenCalledWith(
      { _id: npc._id },
      {
        isGiantForm: false,
      }
    );
    // @ts-expect-error
    expect(npcGiantForm.restoreNPCStatsToNormalForm).toHaveBeenCalledWith(npc);
  });

  it("should not reset NPC to normal form if it is not in giant form", async () => {
    npc.isGiantForm = false;
    // @ts-expect-error
    npcGiantForm.restoreNPCStatsToNormalForm = jest.fn();

    await npcGiantForm.resetNPCToNormalForm(npc);

    expect(NPC.updateOne).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(npcGiantForm.restoreNPCStatsToNormalForm).not.toHaveBeenCalled();
  });

  it("should set NPC to giant form if it is not in giant form", async () => {
    npc.isGiantForm = false;
    npc.alignment = NPCAlignment.Hostile;
    // @ts-expect-error
    npcGiantForm.increaseNPCStatsForGiantForm = jest.fn();

    await npcGiantForm.randomlyTransformNPCIntoGiantForm(npc, 100);

    expect(NPC.updateOne).toHaveBeenCalledWith(
      { _id: npc._id },
      {
        isGiantForm: true,
      }
    );
    // @ts-expect-error
    expect(npcGiantForm.increaseNPCStatsForGiantForm).toHaveBeenCalledWith(npc);
  });

  it("should not set NPC to giant form if it is in giant form", async () => {
    npc.isGiantForm = true;
    npc.alignment = NPCAlignment.Hostile;
    // @ts-expect-error
    npcGiantForm.increaseNPCStatsForGiantForm = jest.fn();

    await npcGiantForm.randomlyTransformNPCIntoGiantForm(npc, 100);

    expect(NPC.updateOne).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(npcGiantForm.increaseNPCStatsForGiantForm).not.toHaveBeenCalled();
  });

  it("should not set NPC to giant form if it is not hostile", async () => {
    npc.isGiantForm = false;
    npc.alignment = NPCAlignment.Neutral;
    // @ts-expect-error
    npcGiantForm.increaseNPCStatsForGiantForm = jest.fn();

    await npcGiantForm.randomlyTransformNPCIntoGiantForm(npc, 100);

    expect(NPC.updateOne).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(npcGiantForm.increaseNPCStatsForGiantForm).not.toHaveBeenCalled();
  });

  it("should not set NPC to giant form if random number is greater than percent", async () => {
    npc.isGiantForm = false;
    npc.alignment = NPCAlignment.Hostile;
    // @ts-expect-error
    npcGiantForm.increaseNPCStatsForGiantForm = jest.fn();

    await npcGiantForm.randomlyTransformNPCIntoGiantForm(npc, 0);

    expect(NPC.updateOne).not.toHaveBeenCalled();
    // @ts-expect-error
    expect(npcGiantForm.increaseNPCStatsForGiantForm).not.toHaveBeenCalled();
  });

  it("should increase NPC stats for giant form", async () => {
    Skill.updateOne = jest.fn();

    npc.maxHealth = 100;
    npc.maxMana = 100;
    await Skill.findOneAndUpdate(
      { owner: npc._id },
      {
        level: 10,
        strength: {
          level: 10,
        },
        dexterity: {
          level: 10,
        },
        resistance: {
          level: 10,
        },
      }
    );

    // @ts-expect-error
    await npcGiantForm.increaseNPCStatsForGiantForm(npc);

    expect(NPC.updateOne).toHaveBeenCalledWith(
      { _id: npc._id },
      {
        maxHealth: 175,
        health: 175,
        mana: 175,
        maxMana: 175,
      }
    );

    expect(Skill.updateOne).toHaveBeenCalledWith(
      { _id: npc.skills },
      {
        level: 18,
        strength: {
          level: 18,
        },
        dexterity: {
          level: 18,
        },
        resistance: {
          level: 18,
        },
      }
    );
  });
});
