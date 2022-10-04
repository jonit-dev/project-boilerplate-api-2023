/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import dayjs from "dayjs";
import { CharacterBan } from "../CharacterBan";

describe("CharacterBan.ts", () => {
  let characterBan: CharacterBan;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    characterBan = container.get<CharacterBan>(CharacterBan);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should add a penalty point, once called addPenalty in a character", async () => {
    await characterBan.addPenalty(testCharacter);

    expect(testCharacter.penalty).toBe(1);
  });

  it("should ban a character, for every 10 penalties, and set 10 days of ban", async () => {
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);
    await characterBan.addPenalty(testCharacter);

    expect(testCharacter.isBanned).toBe(true);

    expect(testCharacter.banRemovalDate).toBeDefined();

    const today = dayjs(new Date());

    const diffBanRemovalDate = dayjs(testCharacter.banRemovalDate!).diff(today, "hours");

    expect(diffBanRemovalDate).toBe(24 * 10 - 1);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
