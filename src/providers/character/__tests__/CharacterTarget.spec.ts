import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { Optional } from "ts-mongoose";

import { CharacterTarget } from "../CharacterTarget";

describe("CharacterTarget.ts", () => {
  let testCharacter: ICharacter;
  let anotherCharacter: ICharacter;
  let characterTarget: CharacterTarget;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterTarget = container.get<CharacterTarget>(CharacterTarget);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
    anotherCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should properly clear the character's target", async () => {
    anotherCharacter.target = {
      id: testCharacter.id,
      type: "Character" as unknown as Optional<string>,
    };
    await anotherCharacter.save();

    expect(anotherCharacter.target.id.toString()).toEqual(testCharacter.id.toString());

    await characterTarget.clearTarget(anotherCharacter);

    const updatedAnotherCharacter = await Character.findOne({ id: anotherCharacter.id });

    expect(updatedAnotherCharacter?.target).toBeUndefined();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
