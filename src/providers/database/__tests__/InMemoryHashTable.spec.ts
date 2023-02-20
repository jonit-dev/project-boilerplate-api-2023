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

    const query2 = await inMemoryHashTable.has("character-view:123", "player-2");

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
