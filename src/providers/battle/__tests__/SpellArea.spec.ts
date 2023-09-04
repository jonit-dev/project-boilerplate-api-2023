import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container, unitTestHelper } from "@providers/inversify/container";
import { AnimationEffectKeys, FromGridX, FromGridY, MagicPower } from "@rpg-engine/shared";
import { SpellArea } from "../../spells/area-spells/SpellArea";

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

    await testCharacter.populate("skills").execPopulate();
    await testCharacterTarget.populate("skills").execPopulate();
    await testNPC.populate("skills").execPopulate();
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

      const { cells, targets } = await spellArea.calculateEffect(testCharacter, spellAreaOrigin, spellAreaGrid);

      // Expected animation cells: []
      expect(cells).toEqual([]);
      expect(targets).toHaveLength(0);
    });

    it("should return the spell area origin for a single-cell spell area grid", async () => {
      const spellAreaOrigin = { x: 0, y: 0 };
      const spellAreaGrid = [[1]];

      const { cells, targets } = await spellArea.calculateEffect(testCharacter, spellAreaOrigin, spellAreaGrid);

      expect(cells).toEqual([{ x: 0, y: 0 }]);
      expect(targets).toHaveLength(0);
    });
  });
});
