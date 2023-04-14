import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CacheModel } from "../CacheModel";

describe("CacheModel", () => {
  let cacheModel: CacheModel;
  let testCharacter: ICharacter;

  beforeAll(() => {
    cacheModel = container.get(CacheModel);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasSkills: true });
  });

  afterEach(async () => {
    await cacheModel.clear("characters");
  });

  it("should get a character from cache", async () => {
    // Set the character in the cache
    await cacheModel.set(Character, "characters", testCharacter._id, "skills");

    // Attempt to get the character from the cache
    const cachedCharacter = await cacheModel.getOrQuery<ICharacter>(
      Character,
      "characters",
      testCharacter._id,
      "skills"
    );

    // Check if the cached character matches the test character
    expect(cachedCharacter).toBeDefined();
    expect(cachedCharacter._id.toString()).toEqual(testCharacter._id.toString());
    expect(cachedCharacter.name).toEqual(testCharacter.name);
    expect(cachedCharacter.skills).toBeDefined();
    const skills = cachedCharacter.skills as ISkill;
    expect(skills.dexterity?.level).toBe(1);
  });

  it("should query and set cache if no cache is found", async () => {
    // Attempt to get a non-cached character
    const nonCachedCharacter = await cacheModel.getOrQuery<ICharacter>(
      Character,
      "characters",
      testCharacter._id,
      "skills"
    );

    // Check if the character fetched from the database matches the test character
    expect(nonCachedCharacter).toBeDefined();
    expect(nonCachedCharacter._id.toString()).toEqual(testCharacter._id.toString());
    expect(nonCachedCharacter.name).toEqual(testCharacter.name);
    expect(nonCachedCharacter.skills).toBeDefined();
    const skills = nonCachedCharacter.skills as ISkill;
    expect(skills.dexterity?.level).toBe(1);

    // Attempt to get the character again, this time it should be from the cache
    const cachedCharacter = await cacheModel.getOrQuery<ICharacter>(
      Character,
      "characters",
      testCharacter._id,
      "skills"
    );

    // Check if the cached character matches the test character
    expect(cachedCharacter).toBeDefined();
    expect(cachedCharacter._id.toString()).toEqual(testCharacter._id.toString());
    expect(cachedCharacter.name).toEqual(testCharacter.name);
    expect(cachedCharacter.skills).toBeDefined();
    const cachedSkills = cachedCharacter.skills as ISkill;
    expect(cachedSkills.dexterity?.level).toBe(1);
  });
});
