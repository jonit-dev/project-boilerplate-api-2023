import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container, unitTestHelper } from "@providers/inversify/container";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import {
  AnimationEffectKeys,
  CharacterClass,
  FromGridX,
  FromGridY,
  MagicPower,
  NPCAlignment,
} from "@rpg-engine/shared";
import { SpellArea } from "../SpellArea";

describe("SpellArea", () => {
  let testCharacter: ICharacter;
  let testCharacterTarget: ICharacter;
  let testNPC: INPC;
  let spellArea: SpellArea;

  beforeAll(() => {
    spellArea = container.get(SpellArea);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        x: FromGridX(1),
        y: FromGridY(1),
      },
      {
        hasSkills: true,
      }
    );
    testCharacterTarget = await unitTestHelper.createMockCharacter(
      {
        x: FromGridX(1),
        y: FromGridY(1),
      },
      {
        hasSkills: true,
      }
    );
    testNPC = await unitTestHelper.createMockNPC(
      {
        x: FromGridX(1),
        y: FromGridY(1),
      },
      {
        hasSkills: true,
      }
    );
    await testNPC.populate("skills").execPopulate();

    await testCharacter.populate("skills").execPopulate();
    await testCharacterTarget.populate("skills").execPopulate();
  });

  describe("Casting", () => {
    it("should properly cast an area spell", async () => {
      // @ts-expect-error
      const hitTargetSpy = jest.spyOn(spellArea.hitTarget, "hit");

      // @ts-expect-error
      const entityEffectSpy = jest.spyOn(spellArea.entityEffectUse, "applyEntityEffects");

      // @ts-expect-error
      const animationEffectSpy = jest.spyOn(spellArea.animationEffect, "sendAnimationEventToXYPosition");

      // place target inside spellAreaGrid
      testNPC.y = FromGridY(1);
      testNPC.x = FromGridX(2);
      testNPC.alignment = "Hostile";
      await testNPC.save();

      await spellArea.cast(testCharacter, testCharacterTarget, MagicPower.High, {
        effectAnimationKey: AnimationEffectKeys.HitFire,
        entityEffect: entityEffectBurning,
        spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
      });

      expect(hitTargetSpy).toHaveBeenCalled();
      expect(entityEffectSpy).toHaveBeenCalled();
      expect(animationEffectSpy).toHaveBeenCalled();
    });
  });

  describe("Calculations", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the correct animation cells", async () => {
      const spellAreaOrigin = { x: 2, y: 2 };
      const spellAreaGrid = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];

      // place target inside spellAreaGrid
      testNPC.y = FromGridY(1);
      testNPC.x = FromGridX(2);
      await testNPC.save();

      // @ts-ignore
      const { cells, targets } = await spellArea.calculateEffect(testCharacter, spellAreaOrigin, spellAreaGrid);

      expect(targets).toHaveLength(1);
      expect(targets[0].intensity).toEqual(1);
      const affectedNPC = targets[0].target as unknown as INPC;
      expect(affectedNPC.id).toEqual(testNPC.id);

      expect(cells).toEqual([
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 3 },
      ]);
    });

    it("should return the correct animation cells - big grid & with intensity", async () => {
      const spellAreaOrigin = { x: 4, y: 4 };
      const spellAreaGrid = [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 2, 1, 0, 0],
        [0, 1, 2, 3, 2, 1, 0],
        [1, 2, 3, 4, 3, 2, 1],
        [0, 1, 2, 3, 2, 1, 0],
        [0, 0, 1, 2, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
      ];

      // place caster inside the spellAreaGrid
      // should not be returned in affected targets
      testCharacter.y = FromGridY(4);
      testCharacter.x = FromGridX(4);
      await testCharacter.save();

      // place targets inside spellAreaGrid
      testNPC.y = FromGridY(4);
      testNPC.x = FromGridX(3);
      await testNPC.save();

      testCharacterTarget.y = FromGridY(5);
      testCharacterTarget.x = FromGridX(5);
      await testCharacterTarget.save();

      // @ts-ignore
      const { cells, targets } = await spellArea.calculateEffect(testCharacter, spellAreaOrigin, spellAreaGrid);

      expect(targets).toHaveLength(2);
      expect(targets[0].intensity).toEqual(3);
      expect(targets[1].intensity).toEqual(2);

      const affectedNPC = targets[0].target as unknown as INPC;
      expect(affectedNPC.id).toEqual(testNPC.id);

      const affectedChar = targets[1].target as unknown as ICharacter;
      expect(affectedChar.id).toEqual(testCharacterTarget.id);

      expect(cells).toEqual([
        { x: 4, y: 1 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 5, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 6, y: 4 },
        { x: 7, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 3, y: 6 },
        { x: 4, y: 6 },
        { x: 5, y: 6 },
        { x: 4, y: 7 },
      ]);
    });

    it("should return an empty array for an empty spell area grid", async () => {
      const spellAreaOrigin = { x: 1, y: 1 };
      const spellAreaGrid: number[][] = [[]];

      // @ts-ignore
      const { cells, targets } = await spellArea.calculateEffect(testCharacter, spellAreaOrigin, spellAreaGrid);

      // Expected animation cells: []
      expect(cells).toEqual([]);
      expect(targets).toHaveLength(0);
    });

    it("should return the spell area origin for a single-cell spell area grid", async () => {
      const spellAreaOrigin = { x: 0, y: 0 };
      const spellAreaGrid = [[1]];

      // @ts-ignore
      const { cells, targets } = await spellArea.calculateEffect(testCharacter, spellAreaOrigin, spellAreaGrid);

      expect(cells).toEqual([{ x: 0, y: 0 }]);
      expect(targets).toHaveLength(0);
    });
  });

  describe("Validations", () => {
    let testNPC: INPC;
    let hitTargetSpy: jest.SpyInstance;
    let testCharacter: ICharacter;

    const testSpellAreaOptions = {
      effectAnimationKey: AnimationEffectKeys.HitFire,
      entityEffect: entityEffectBurning,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
    };

    beforeEach(async () => {
      jest.clearAllMocks();

      testNPC = await unitTestHelper.createMockNPC(
        {
          key: HostileNPCsBlueprint.OrcMage,
          x: FromGridX(0),
          y: FromGridX(0),
        },
        { hasSkills: true }
      );

      // @ts-ignore
      hitTargetSpy = jest.spyOn(spellArea.hitTarget, "hit");

      testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
    });

    it("when an NPC cast area spell into another NPC, it should not be hit", async () => {
      const testNPC2 = await unitTestHelper.createMockNPC(
        {
          key: HostileNPCsBlueprint.Orc,
          x: FromGridX(1),
          y: FromGridX(1),
        },
        { hasSkills: true }
      );

      await spellArea.cast(testNPC, testNPC2, MagicPower.High, testSpellAreaOptions);

      expect(hitTargetSpy).not.toHaveBeenCalled();
    });

    it("characters should not hit friendly NPCs", async () => {
      const testFriendlyNPC = await unitTestHelper.createMockNPC(
        {
          alignment: NPCAlignment.Friendly,
          key: FriendlyNPCsBlueprint.Agatha,
          x: FromGridX(1),
          y: FromGridX(1),
        },
        { hasSkills: true }
      );

      const result = await spellArea.cast(testCharacter, testFriendlyNPC, MagicPower.High, testSpellAreaOptions);

      expect(result).toBe(undefined);
    });

    describe("PVP", () => {
      let testAnotherCharacter: ICharacter;

      const testSpellAreaOptions = {
        effectAnimationKey: AnimationEffectKeys.HitFire,
        entityEffect: entityEffectBurning,
        spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
      };

      beforeEach(async () => {
        await NPC.deleteMany({}); // its a PVP testing, so remove all NPCs

        testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
        testAnotherCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
      });

      afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
      });

      it("should block a NonPVP zone attack", async () => {
        // @ts-ignore
        jest.spyOn(spellArea.mapNonPVPZone, "isNonPVPZoneAtXY").mockReturnValue(true);

        const result = await spellArea.cast(testCharacter, testAnotherCharacter, MagicPower.High, {
          ...testSpellAreaOptions,
          noCastInNonPvPZone: true,
        });

        expect(result).toBe(undefined);
      });

      it("If the level is lower than PVP_MIN_REQUIRED_LV, it avoids the attack", async () => {
        const result = await spellArea.cast(testCharacter, testAnotherCharacter, MagicPower.High, testSpellAreaOptions);

        expect(result).toBe(undefined);
      });

      it("should prevent a character from attacking another one that's on the same party", async () => {
        const party = new CharacterParty({
          leader: {
            _id: testCharacter._id,
            class: CharacterClass.Druid,
            name: "Test Character",
          },
          members: [
            {
              _id: testAnotherCharacter._id,
              class: CharacterClass.Berserker,
              name: "Test Another Character",
            },
          ],
          maxSize: 2,
          benefits: [],
        });
        await party.save();

        const result = await spellArea.cast(testCharacter, testAnotherCharacter, MagicPower.High, testSpellAreaOptions);

        expect(result).toBe(undefined);
      });
    });
  });
});
