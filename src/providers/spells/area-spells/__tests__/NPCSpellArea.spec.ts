import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { FromGridX } from "@rpg-engine/shared";
import _ from "lodash";
import { NPCSpellArea } from "../NPCSpellArea";

describe("NPCSpellArea.spec.ts", () => {
  describe("NPC Area spells", () => {
    let testNPC: INPC;
    let testCharacter: ICharacter;
    let npcSpellArea: NPCSpellArea;
    let npcAreaSpellSpy: jest.SpyInstance;

    beforeAll(() => {
      npcSpellArea = container.get<NPCSpellArea>(NPCSpellArea);
    });

    beforeEach(() => {
      jest.spyOn(_, "random").mockImplementation(() => 0);
    });

    it("an NPC with area spell, should properly cast it at a target", async () => {
      testNPC = await unitTestHelper.createMockNPC(
        {
          key: HostileNPCsBlueprint.OrcMage,
          x: FromGridX(0),
          y: FromGridX(0),
        },
        { hasSkills: true }
      );

      testCharacter = await unitTestHelper.createMockCharacter(
        {
          x: FromGridX(1),
          y: FromGridX(1),
        },
        {
          hasEquipment: true,
          hasSkills: true,
        }
      );

      const result = await npcSpellArea.castNPCSpell(testNPC, testCharacter);

      expect(result).toBe(true);
    });
  });
});
