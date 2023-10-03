import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { DiscordBot } from "@providers/discord/DiscordBot";
import { NPCSpawn } from "@providers/npc/NPCSpawn";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { Time } from "@providers/time/Time";
import { IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { IRaid, RaidManager } from "./RaidManager";

@provide(NPCRaidActivator)
export class NPCRaidActivator {
  constructor(
    private socketMessaging: SocketMessaging,
    private npcSpawn: NPCSpawn,
    private raid: RaidManager,
    private raidManager: RaidManager,
    private time: Time,
    private discordBot: DiscordBot
  ) {}

  @TrackNewRelicTransaction()
  public async activateRaids(): Promise<void> {
    try {
      const selectedRaid = await this.getRandomInactiveRaid();

      if (!selectedRaid) {
        return;
      }

      const isRaidAlreadyActive = await this.raidManager.isRaidActive(selectedRaid.key);

      if (isRaidAlreadyActive) {
        console.log("Raid is already active:", selectedRaid.key);
        return;
      }

      console.log("Activating raid:", selectedRaid.key);

      const messageDiscord = `**Raid ${selectedRaid.name} is starting** ${selectedRaid.startingMessage}`;
      await this.discordBot.sendMessage(messageDiscord, "raids");

      this.broadcastRaidWarning(selectedRaid);

      await this.enableRaid(selectedRaid);

      const npcsFromRaid = await NPC.find({ raidKey: selectedRaid.key });

      await this.spawnNPCs(npcsFromRaid);
    } catch (error) {
      console.error("Error while processing the raid task:", error);
    }
  }

  private broadcastRaidWarning(raid: IRaid): void {
    if (!raid.startingMessage) {
      return;
    }

    this.socketMessaging.sendEventToAllUsers<IUIShowMessage>(UISocketEvents.ShowMessage, {
      message: raid.startingMessage,
      type: "warning",
    });
  }

  private async enableRaid(raid: IRaid): Promise<void> {
    await this.raid.updateRaid(raid.key, { ...raid, status: true, lastActivationTime: new Date() });
  }

  private async spawnNPCs(npcs: INPC[]): Promise<void> {
    const npcPromises = npcs.filter((npc) => npc.health === 0).map((npc) => this.npcSpawn.spawn(npc, true));

    await Promise.all(npcPromises);
  }

  @TrackNewRelicTransaction()
  public async shutdownRaids(): Promise<void> {
    await this.time.waitForMilliseconds(10); // added this to avoid activating and deactivating at the same time

    try {
      // Fetch only the active raids
      await this.shutdownAllActiveRaids();
    } catch (error) {
      console.error("Error while processing raid task:", error);
    }
  }

  private async shutdownAllActiveRaids(): Promise<void> {
    const activeRaids = await this.raid.queryRaids({ status: true });

    if (activeRaids.length === 0) return;

    for (const activeRaid of activeRaids) {
      if (!activeRaid.lastActivationTime) {
        await this.disableRaid(activeRaid);
        console.log("Shutting down raid:", activeRaid.key);
        continue;
      }

      await this.disableExpiredRaids(activeRaid);
    }
  }

  private async disableExpiredRaids(activeRaid: IRaid): Promise<void> {
    const now = new Date();

    const diff = dayjs(now).diff(dayjs(activeRaid.lastActivationTime), "minute");

    if (diff >= activeRaid.minDuration) {
      await this.disableRaid(activeRaid);
      console.log("Shutting down raid:", activeRaid.key);
    }
  }

  private async disableRaid(raid: IRaid): Promise<void> {
    await this.raid.updateRaid(raid.key, { ...raid, status: false });

    // Notify all users that the raid is over
    this.socketMessaging.sendEventToAllUsers<IUIShowMessage>(UISocketEvents.ShowMessage, {
      message: `You are safe now. Raid "${raid.name}" is over!`,
      type: "info",
    });
  }

  private async getRandomInactiveRaid(): Promise<IRaid | null> {
    const raids = await this.raid.queryRaids({ status: false });

    const eligibleRaids = raids.filter((raid) => {
      const randomValue = random(0, 100); // Get a random number between 1 and 100

      return randomValue <= raid.triggeringChance; // Check if the random number is less than or equal to the raid's triggering chance
    });

    if (eligibleRaids.length === 0) {
      return null; // Return null if no raids are eligible
    }

    const randomIndex = Math.floor(Math.random() * eligibleRaids.length); // Get a random index between 0 and the number of eligible raids

    return eligibleRaids[randomIndex]; // Return the raid at the random index
  }
}
