import { container, unitTestHelper } from "@providers/inversify/container";
import dayjs from "dayjs";
import { NPCRaidActivator } from "../NPCRaidActivator";
import { RaidManager } from "../RaidManager";

describe("NPCRaidActivator", () => {
  let npcRaidActivator: NPCRaidActivator;
  let raidManager: RaidManager;

  let spyNPCSpawns: jest.SpyInstance;
  let spySendEventToAllUsers: jest.SpyInstance;

  beforeAll(() => {
    npcRaidActivator = container.get(NPCRaidActivator);
    raidManager = container.get(RaidManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    await unitTestHelper.createMockNPC({
      raidKey: "test-raid",
    });

    // @ts-ignore
    spySendEventToAllUsers = jest.spyOn(npcRaidActivator.socketMessaging, "sendEventToAllUsers");

    await raidManager.deleteAllRaids();

    await raidManager.addRaid({
      name: "Test Raid",
      key: "test-raid",
      startingMessage: "This is a test raid starting!",
      status: false,
      triggeringChance: 100,
      minDuration: 10,
    });
  });

  it("should activate a raid", async () => {
    spyNPCSpawns = jest.spyOn(npcRaidActivator as any, "spawnNPCs");

    await npcRaidActivator.activateRaids();

    const raidQuery = await raidManager.getRaid("test-raid");

    expect(raidQuery?.status).toBe(true);

    expect(spyNPCSpawns).toBeCalledTimes(1);

    expect(spyNPCSpawns).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          raidKey: "test-raid",
        }),
      ])
    );
  });

  it("should broadcast a warning message when activating a raid", async () => {
    await npcRaidActivator.activateRaids();
    expect(spySendEventToAllUsers).toBeCalledWith(
      "ShowMessage",
      expect.objectContaining({
        message: "This is a test raid starting!",
        type: "warning",
      })
    );
  });

  it("should shutdown raids", async () => {
    await npcRaidActivator.shutdownRaids();
    const raidQuery = await raidManager.getRaid("test-raid");
    expect(raidQuery?.status).toBe(false);
  });

  it("should broadcast an 'all clear' message when shutting down raids", async () => {
    await raidManager.updateRaid("test-raid", { status: true });

    await npcRaidActivator.shutdownRaids();

    expect(spySendEventToAllUsers).toBeCalledWith(
      "ShowMessage",
      expect.objectContaining({
        message: 'You are safe now. Raid "Test Raid" is over!',
        type: "info",
      })
    );
  });

  it("should disable expired raids", async () => {
    // Initialize raid with lastActivationTime set to a past time
    const pastTime = dayjs().subtract(11, "minute").toDate();
    await raidManager.updateRaid("test-raid", { status: true, lastActivationTime: pastTime });

    const spyDisableExpiredRaids = jest.spyOn(npcRaidActivator as any, "disableExpiredRaids");

    // Call the method responsible for shutting down raids
    await npcRaidActivator.shutdownRaids();

    // Assert that disableExpiredRaids was called
    expect(spyDisableExpiredRaids).toBeCalled();

    // Fetch the raid to check its status
    const raidQuery = await raidManager.getRaid("test-raid");

    // Verify that the raid is disabled
    expect(raidQuery?.status).toBe(false);
  });
});
