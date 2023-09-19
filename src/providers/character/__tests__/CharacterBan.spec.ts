import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import dayjs from "dayjs";
import { CharacterBan } from "../CharacterBan";

describe("CharacterBan.ts", () => {
  let characterBan: CharacterBan;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBan = container.get<CharacterBan>(CharacterBan);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should add a penalty point, once called addPenalty in a character", async () => {
    await characterBan.addPenalty(testCharacter);

    testCharacter = (await Character.findById(testCharacter._id).lean().select("penalty")) as ICharacter;

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

    testCharacter = (await Character.findById(testCharacter._id)
      .lean()
      .select("penalty isBanned banRemovalDate")) as ICharacter;

    expect(testCharacter.isBanned).toBe(true);

    expect(testCharacter.banRemovalDate).toBeDefined();

    const today = dayjs(new Date());

    const banRemovalDate = dayjs(testCharacter.banRemovalDate);

    expect(banRemovalDate.diff(today, "day")).toBe(9);
  });

  it("should ban a character with next penalty", async () => {
    testCharacter.penalty = 11;
    await characterBan.increasePenaltyAndBan(testCharacter);

    testCharacter = (await Character.findById(testCharacter._id)
      .lean()
      .select("penalty isBanned banRemovalDate")) as ICharacter;

    expect(testCharacter.isBanned).toBe(true);
    expect(testCharacter.penalty).toBe(20);
    expect(testCharacter.banRemovalDate).toBeDefined();

    const today = dayjs(new Date());

    const banRemovalDate = dayjs(testCharacter.banRemovalDate);

    expect(banRemovalDate.diff(today, "day")).toBe(19);
  });
});
