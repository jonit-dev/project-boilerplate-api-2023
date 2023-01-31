import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { RedisManager } from "@providers/database/RedisManager";
import { container, unitTestHelper } from "@providers/inversify/container";
import { InMemoryRepository } from "../InMemoryRepository";

describe("InMemoryRepository", () => {
  let redisManager: RedisManager;
  let inMemoryRepository: InMemoryRepository;
  let testCharacter: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    redisManager = container.get<RedisManager>(RedisManager);
    await redisManager.connect();

    inMemoryRepository = container.get<InMemoryRepository>(InMemoryRepository);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
  });

  it("saves a data structure to redis", async () => {
    const savedData = await inMemoryRepository.create<ICharacter>("characters", testCharacter);

    expect(savedData).toBeTruthy();

    expect(String(savedData._id)).toStrictEqual(String(testCharacter._id));
  });

  it("retrieves a data structure from redis", async () => {
    const savedData = await inMemoryRepository.create<ICharacter>("characters", testCharacter);

    const retrievedData = await inMemoryRepository.read<ICharacter>("characters", savedData._id);

    expect(retrievedData).toBeTruthy();

    expect(String(retrievedData._id)).toStrictEqual(String(testCharacter._id));
  });

  it("updates a data structure in redis", async () => {
    const updatedData = await inMemoryRepository.update<ICharacter>("characters", testCharacter);

    expect(updatedData).toBeTruthy();

    expect(String(updatedData._id)).toStrictEqual(String(testCharacter._id));
  });

  it("deletes a data structure in redis", async () => {
    const deletedData = await inMemoryRepository.delete("characters", testCharacter._id);

    expect(deletedData).toBeTruthy();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
