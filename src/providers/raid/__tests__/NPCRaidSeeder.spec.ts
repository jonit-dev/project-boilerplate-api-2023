import { container } from "@providers/inversify/container";
import { NPCRaidSeeder } from "../NPCRaidSeeder";
import { RaidManager } from "../RaidManager";

describe("NPCRaidSeeder", () => {
  let npcRaidSeeder: NPCRaidSeeder;
  let raidManager: RaidManager;

  beforeAll(() => {
    npcRaidSeeder = container.get(NPCRaidSeeder);
    raidManager = container.get(RaidManager);
  });

  beforeEach(async () => {
    // Clean the environment before each test
    await raidManager.deleteAllRaids();
  });

  it("should seed a raid", async () => {
    await npcRaidSeeder.seed();

    const allRaidKeys = await raidManager.getAllRaidKeys();
    expect(allRaidKeys).toContain("orc-raid-ilya");
  });

  it("should not duplicate an existing raid", async () => {
    // Manually add a raid that is supposed to be seeded
    await raidManager.addRaid({
      name: "Ilya Orc's Invasion",
      key: "orc-raid-ilya",
      startingMessage: "Test message",
      status: false,
      triggeringChance: 20,
      minDuration: 10,
    });

    await npcRaidSeeder.seed();

    const allRaidKeys = await raidManager.getAllRaidKeys();
    const occurrences = allRaidKeys.filter((key) => key === "orc-raid-ilya").length;
    expect(occurrences).toEqual(1); // should not duplicate
  });
});
