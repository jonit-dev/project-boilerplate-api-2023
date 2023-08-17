import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterFactions } from "@rpg-engine/shared";
import { CharacterSkull } from "../CharacterSkull";

describe("CharacterSkull.ts", () => {
  let characterSkull: CharacterSkull;
  let testCharacter: ICharacter;
  let testTargetCharacter: ICharacter;

  beforeAll(() => {
    characterSkull = container.get<CharacterSkull>(CharacterSkull);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
    testTargetCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
  });

  it("should know if target is unjustify attack", () => {
    testCharacter.faction = CharacterFactions.LifeBringer;
    testCharacter.hasSkull = false;
    testTargetCharacter.faction = CharacterFactions.LifeBringer;
    testTargetCharacter.hasSkull = false;
    const isTargetUnjustifiedAttack = characterSkull.checkForUnjustifiedAttack(testCharacter, testTargetCharacter);

    expect(isTargetUnjustifiedAttack).toBeTruthy();
  });

  it("should know if target is not unjustify attack when faction is not the same", () => {
    testCharacter.faction = CharacterFactions.LifeBringer;
    testCharacter.hasSkull = false;
    testTargetCharacter.faction = CharacterFactions.ShadowWalker;
    testTargetCharacter.hasSkull = false;
    const isTargetUnjustifiedAttack = characterSkull.checkForUnjustifiedAttack(testCharacter, testTargetCharacter);

    expect(isTargetUnjustifiedAttack).toBeFalsy;
  });

  it("should know if target is not unjustify attack when target has skull", () => {
    testCharacter.faction = CharacterFactions.LifeBringer;
    testCharacter.hasSkull = false;
    testTargetCharacter.faction = CharacterFactions.LifeBringer;
    testTargetCharacter.hasSkull = true;
    const isTargetUnjustifiedAttack = characterSkull.checkForUnjustifiedAttack(testCharacter, testTargetCharacter);

    expect(isTargetUnjustifiedAttack).toBeFalsy;
  });
});
