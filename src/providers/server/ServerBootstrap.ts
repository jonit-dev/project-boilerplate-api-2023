import { CharacterConnection } from "@providers/character/CharacterConnection";

import { CharacterTextureChange } from "@providers/character/CharacterTextureChange";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { PathfindingQueue } from "@providers/map/PathfindingQueue";
import { PathfindingResults } from "@providers/map/PathfindingResults";
import { NPCManager } from "@providers/npc/NPCManager";
import { PushNotificationHelper } from "@providers/pushNotification/PushNotificationHelper";
import { Seeder } from "@providers/seeds/Seeder";

import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { HitTarget } from "@providers/battle/HitTarget";
import { CharacterConsumptionControl } from "@providers/character/CharacterConsumptionControl";
import { CharacterMonitorQueue } from "@providers/character/CharacterMonitorQueue";
import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { DiscordBot } from "@providers/discord/DiscordBot";
import { EntityEffectDurationControl } from "@providers/entityEffects/EntityEffectDurationControl";
import { blueprintManager } from "@providers/inversify/container";
import { ItemUseCycleQueue } from "@providers/item/ItemUseCycleQueue";
import { Locker } from "@providers/locks/Locker";
import { NPCBattleCycleQueue } from "@providers/npc/NPCBattleCycleQueue";
import { NPCCycleQueue } from "@providers/npc/NPCCycleQueue";
import { NPCFreezer } from "@providers/npc/NPCFreezer";
import PartyManagement from "@providers/party/PartyManagement";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import SpellSilence from "@providers/spells/data/logic/mage/druid/SpellSilence";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { PM2Helper } from "./PM2Helper";

@provide(ServerBootstrap)
export class ServerBootstrap {
  constructor(
    private pm2Helper: PM2Helper,
    private npcManager: NPCManager,
    private seeder: Seeder,
    private characterConnection: CharacterConnection,
    private characterConsumptionControl: CharacterConsumptionControl,
    private pathfindingQueue: PathfindingQueue,
    private characterBuffActivator: CharacterBuffActivator,
    private spellSilence: SpellSilence,
    private characterTextureChange: CharacterTextureChange,
    private pathfindingResults: PathfindingResults,
    private npcFreezer: NPCFreezer,
    private locker: Locker,
    private partyManagement: PartyManagement,
    private inMemoryHashTable: InMemoryHashTable,
    private hitTarget: HitTarget,
    private discordBot: DiscordBot,
    private socketSessionControl: SocketSessionControl,
    private npcBattleCycleQueue: NPCBattleCycleQueue,
    private characterMonitorQueue: CharacterMonitorQueue,
    private npcCycleQueue: NPCCycleQueue,
    private itemUseCycleQueue: ItemUseCycleQueue,
    private entityEffectDuration: EntityEffectDurationControl
  ) {}

  // operations that can be executed in only one CPU instance without issues with pm2 (ex. setup centralized state doesnt need to be setup in every pm2 instance!)
  @TrackNewRelicTransaction()
  public async performOneTimeOperations(): Promise<void> {
    if (appEnv.general.ENV === EnvType.Development) {
      // in dev we always want to execute it.. since we dont have pm2
      await this.execOneTimeOperations();
    } else {
      // Production/Staging with PM2
      if (process.env.pm_id === this.pm2Helper.pickLastCPUInstance()) {
        await this.execOneTimeOperations();
      }
    }
  }

  @TrackNewRelicTransaction()
  public async performMultipleInstancesOperations(): Promise<void> {
    this.discordBot.initialize();

    await this.queueShutdownHandling();

    await this.clearAllQueues();
  }

  public queueShutdownHandling(): void {
    const execQueueShutdown = async (): Promise<void> => {
      await this.npcBattleCycleQueue.shutdown();
      await this.npcCycleQueue.shutdown();
      await this.characterMonitorQueue.shutdown();
      await this.hitTarget.shutdown();
      await this.pathfindingQueue.shutdown();
      await this.itemUseCycleQueue.shutdown();
    };

    process.on("SIGTERM", async () => {
      await execQueueShutdown();

      process.exit(0);
    });

    process.on("SIGINT", async () => {
      await execQueueShutdown();
      process.exit(0);
    });
  }

  private async execOneTimeOperations(): Promise<void> {
    await this.socketSessionControl.clearAllSessions();

    await blueprintManager.loadAllBlueprints();

    await this.npcManager.disableNPCBehaviors();

    await this.characterConnection.resetCharacterAttributes();
    await this.characterConsumptionControl.clearAllItemConsumption();
    await this.characterBuffActivator.disableAllTemporaryBuffsAllCharacters();
    await this.partyManagement.clearAllParties();

    await this.spellSilence.removeAllSilence();

    await this.characterTextureChange.removeAllTextureChange();

    await this.pathfindingResults.clearAllResults();

    await this.inMemoryHashTable.deleteAll("crafting-recipes");
    await this.inMemoryHashTable.deleteAll("craftable-item-ingredients");
    await this.inMemoryHashTable.deleteAll("load-craftable-items");
    await this.inMemoryHashTable.deleteAll("channel-bound-events");
    await this.inMemoryHashTable.deleteAll("raids");
    await this.entityEffectDuration.clearAll();

    // Firebase-admin setup, that push notification requires.
    PushNotificationHelper.initialize();

    // this.heapMonitor.monitor();

    await this.seeder.start();

    this.npcFreezer.init();

    await this.locker.clear();
  }

  private async clearAllQueues(): Promise<void> {
    await this.npcBattleCycleQueue.clearAllJobs();
    await this.npcCycleQueue.clearAllJobs();
    await this.characterMonitorQueue.clearAllJobs();
    await this.pathfindingQueue.clearAllJobs();
    await this.hitTarget.clearAllQueueJobs();
    await this.itemUseCycleQueue.clearAllJobs();

    console.log("🧹 BullMQ queues cleared...");
  }
}
