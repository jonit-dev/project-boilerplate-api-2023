import { container } from "@providers/inversify/container";

import { InMemoryHashTable } from "../InMemoryHashTable";

describe("InMemoryHashTable", () => {
  let inMemoryHashTable: InMemoryHashTable;

  beforeAll(() => {
    inMemoryHashTable = container.get(InMemoryHashTable);
  });

  it("gets a value", async () => {
    await inMemoryHashTable.set("character-view:123", "1313131", {
      x: 10,
      y: 10,
    });

    const query = await inMemoryHashTable.get("character-view:123", "1313131");

    const falseQuery = await inMemoryHashTable.get("character-view:inexistent-namespace", "1313132");

    expect(query).toMatchObject({
      x: 10,
      y: 10,
    });

    expect(falseQuery).toBe(undefined);
  });

  it("should set a value", async () => {
    await inMemoryHashTable.set("character-view:123", "1313131", {
      x: 10,
      y: 10,
    });

    const query = await inMemoryHashTable.get("character-view:123", "1313131");

    expect(query).toMatchObject({
      x: 10,
      y: 10,
    });
  });

  it("verifies the existence or non existence of a value", async () => {
    await inMemoryHashTable.set("character-view:123", "player-1", {
      x: 10,
      y: 13,
    });

    const query = await inMemoryHashTable.has("character-view:123", "player-1");

    expect(query).toBe(true);

    const query2 = await inMemoryHashTable.has("character-view:non-existant-id", "player-2");

    expect(query2).toBe(false);
  });

  it("verifies existence of namespace", async () => {
    await inMemoryHashTable.set("character-view:123", "player-1", {
      x: 10,
      y: 13,
    });

    const query = await inMemoryHashTable.hasAll("character-view:123");

    const falseQuery = await inMemoryHashTable.hasAll("character-view:1234");

    expect(query).toBe(true);

    expect(falseQuery).toBe(false);
  });

  it("should set multiple values", async () => {
    await inMemoryHashTable.set("character-view:123", "player-1", {
      x: 10,
      y: 13,
    });

    await inMemoryHashTable.set("character-view:123", "player-2", {
      x: 11,
      y: 12,
    });

    await inMemoryHashTable.set("character-view:123", "player-3", {
      x: 13,
      y: 8,
    });

    const query = await inMemoryHashTable.getAll("character-view:123");

    expect(query).toMatchObject({
      "player-1": {
        x: 10,
        y: 13,
      },
      "player-2": {
        x: 11,
        y: 12,
      },
      "player-3": {
        x: 13,
        y: 8,
      },
    });
  });

  it("counts the boolean enabled values correctly", async () => {
    // Setting sample data
    await inMemoryHashTable.set("test-namespace", "value1", true);
    await inMemoryHashTable.set("test-namespace", "value2", false);
    await inMemoryHashTable.set("test-namespace", "value3", true);
    await inMemoryHashTable.set("test-namespace", "value4", false);

    // Count the (true) values
    const enabledCount = await inMemoryHashTable.countBooleanEnabledValues("test-namespace", true);

    // Count the (false) values
    const disabledCount = await inMemoryHashTable.countBooleanEnabledValues("test-namespace", false);

    expect(enabledCount).toBe(2);
    expect(disabledCount).toBe(2);
  });

  it("returns 0 for non-existent namespace", async () => {
    // No value is set for this namespace
    const count = await inMemoryHashTable.countBooleanEnabledValues("non-existent-namespace", true);

    expect(count).toBe(0);
  });

  it("batch retrieves values for a set of keys", async () => {
    // Assuming you've set these values in the real system or you've mocked them to be returned
    await inMemoryHashTable.set("batch-namespace", "key1", "value1");
    await inMemoryHashTable.set("batch-namespace", "key2", "value2");

    const result = await inMemoryHashTable.batchGet("batch-namespace", ["key1", "key2"]);

    expect(result).toMatchObject({
      key1: "value1",
      key2: "value2",
    });
  });

  it("returns empty object for invalid namespace", async () => {
    const result = await inMemoryHashTable.batchGet("", ["key1"]);

    expect(result).toMatchObject({});
  });

  it("returns empty object for empty keys array", async () => {
    const result = await inMemoryHashTable.batchGet("batch-namespace", []);

    expect(result).toMatchObject({});
  });

  it("returns empty object for unexpected RedisManager outputs", async () => {
    // @ts-ignore
    jest.spyOn(inMemoryHashTable.redisManager.client, "hmGet").mockResolvedValueOnce("invalidValue");

    const result = await inMemoryHashTable.batchGet("batch-namespace", ["key1"]);

    expect(result).toMatchObject({});
  });

  it("deletes all values", async () => {
    await inMemoryHashTable.set("character-view:123", "player-1", {
      x: 10,
      y: 13,
    });

    await inMemoryHashTable.set("character-view:123", "player-2", {
      x: 11,
      y: 12,
    });

    await inMemoryHashTable.set("character-view:123", "player-3", {
      x: 13,
      y: 8,
    });

    await inMemoryHashTable.deleteAll("character-view:123");

    try {
      await inMemoryHashTable.getAll("character-view:123");
    } catch (error) {
      expect(error.message).toBe("Failed to find value");
    }
  });

  it("deletes a value properly", async () => {
    await inMemoryHashTable.set("character-view:123", "player-1", {
      x: 10,
      y: 13,
    });

    await inMemoryHashTable.set("character-view:123", "player-2", {
      x: 11,
      y: 12,
    });

    await inMemoryHashTable.set("character-view:123", "player-3", {
      x: 13,
      y: 8,
    });

    await inMemoryHashTable.delete("character-view:123", "player-1");

    const query = await inMemoryHashTable.getAll("character-view:123");

    expect(query).toMatchObject({
      "player-2": {
        x: 11,
        y: 12,
      },
      "player-3": {
        x: 13,
        y: 8,
      },
    });
  });
});
