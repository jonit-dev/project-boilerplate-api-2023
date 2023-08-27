import { container } from "@providers/inversify/container";
import { IRaid, RaidManager } from "@providers/raid/RaidManager";

describe("RaidManager", () => {
  let raidManager: RaidManager;

  beforeAll(() => {
    raidManager = container.get(RaidManager);
  });

  it("should add a new raid and retrieve it", async () => {
    const raid: IRaid = {
      name: "test raid",
      key: "raid1",
      startingMessage: "warning",
      status: true,
      triggeringChance: 10,
      minDuration: 10,
    };

    await raidManager.addRaid(raid);
    const raidQuery = await raidManager.getRaid("raid1");
    expect(raidQuery).toEqual(raid);
  });

  it("should update a raid and retrieve the updated version", async () => {
    const raidUpdated: IRaid = {
      name: "test raid",
      key: "raid1",
      startingMessage: "warning updated",
      status: false,
      triggeringChance: 15,
      minDuration: 10,
    };

    await raidManager.updateRaid("raid1", raidUpdated);
    const raidQuery = await raidManager.getRaid("raid1");
    expect(raidQuery).toEqual(raidUpdated);
  });

  it("should delete a raid and confirm its absence", async () => {
    await raidManager.deleteRaid("raid1");
    const raidQuery = await raidManager.getRaid("raid1");
    expect(raidQuery).toBeUndefined();
  });

  it("should retrieve all raids", async () => {
    const raid1: IRaid = {
      name: "test raid",
      key: "raid1",
      startingMessage: "warning1",
      status: true,
      triggeringChance: 10,
      minDuration: 10,
    };

    const raid2: IRaid = {
      name: "test raid",
      key: "raid2",
      startingMessage: "warning2",
      status: false,
      triggeringChance: 20,
      minDuration: 10,
    };

    await raidManager.addRaid(raid1);
    await raidManager.addRaid(raid2);

    const allRaids = await raidManager.getAllRaids();
    expect(allRaids).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: raid1.key,
        }),
        expect.objectContaining({
          key: raid2.key,
        }),
      ])
    );
  });

  it("should retrieve all raid keys", async () => {
    const raid1: IRaid = {
      name: "test raid",
      key: "raid1",
      startingMessage: "warning1",
      status: true,
      triggeringChance: 10,
      minDuration: 10,
    };

    const raid2: IRaid = {
      name: "test raid",
      key: "raid2",
      startingMessage: "warning2",
      status: false,
      triggeringChance: 20,
      minDuration: 10,
    };

    await raidManager.addRaid(raid1);
    await raidManager.addRaid(raid2);

    const allKeys = await raidManager.getAllRaidKeys();
    expect(allKeys).toEqual(expect.arrayContaining([raid1.key, raid2.key]));
  });

  it("should query raids based on the provided criteria", async () => {
    const raid1: IRaid = {
      name: "test raid",
      key: "raid1",
      startingMessage: "warning1",
      status: true,
      triggeringChance: 10,
      minDuration: 10,
    };

    const raid2: IRaid = {
      name: "test raid",
      key: "raid2",
      startingMessage: "warning2",
      status: false,
      triggeringChance: 20,
      minDuration: 10,
    };

    const raid3: IRaid = {
      name: "test raid",
      key: "raid3",
      startingMessage: "warning3",
      status: true,
      triggeringChance: 30,
      minDuration: 10,
    };

    // Add raids
    await raidManager.addRaid(raid1);
    await raidManager.addRaid(raid2);
    await raidManager.addRaid(raid3);

    // Query raids where status is true
    const queriedRaids = await raidManager.queryRaids({ status: true });

    expect(queriedRaids).toEqual(expect.arrayContaining([raid1, raid3]));
    expect(queriedRaids).not.toEqual(expect.arrayContaining([raid2]));

    // Query raids where triggeringChance is 30
    const queriedRaidsTriggerChance = await raidManager.queryRaids({ triggeringChance: 30 });

    expect(queriedRaidsTriggerChance).toEqual([raid3]);
  });
});
