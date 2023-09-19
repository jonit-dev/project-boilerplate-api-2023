import { CharacterConnection } from "@providers/character/CharacterConnection";
import { CharacterFoodConsumption } from "@providers/character/CharacterFoodConsumption";
import { CharacterMonitor } from "@providers/character/CharacterMonitor";
import { CharacterTextureChange } from "@providers/character/CharacterTextureChange";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { PathfindingQueue } from "@providers/map/PathfindingQueue";
import { PathfindingResults } from "@providers/map/PathfindingResults";
import { NPCManager } from "@providers/npc/NPCManager";
import { PushNotificationHelper } from "@providers/pushNotification/PushNotificationHelper";
import { Seeder } from "@providers/seeds/Seeder";

import { HitTarget } from "@providers/battle/HitTarget";
import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { DiscordBot } from "@providers/discord/DiscordBot";
import { blueprintManager } from "@providers/inversify/container";
import { Locker } from "@providers/locks/Locker";
import { NPCFreezer } from "@providers/npc/NPCFreezer";
import PartyManagement from "@providers/party/PartyManagement";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import SpellSilence from "@providers/spells/data/logic/mage/druid/SpellSilence";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { HeapMonitor } from "./HeapMonitor";
import { PM2Helper } from "./PM2Helper";

@provide(ServerBootstrap)
export class ServerBootstrap {
  constructor(
    private pm2Helper: PM2Helper,
    private npcManager: NPCManager,
    private seeder: Seeder,
    private characterConnection: CharacterConnection,
    private characterFoodConsumption: CharacterFoodConsumption,
    private pathfindingQueue: PathfindingQueue,
    private characterBuffActivator: CharacterBuffActivator,
    private spellSilence: SpellSilence,
    private characterTextureChange: CharacterTextureChange,
    private pathfindingResults: PathfindingResults,
    private characterMonitor: CharacterMonitor,
    private heapMonitor: HeapMonitor,
    private npcFreezer: NPCFreezer,
    private locker: Locker,
    private partyManagement: PartyManagement,
    private inMemoryHashTable: InMemoryHashTable,
    private hitTarget: HitTarget,
    private discordBot: DiscordBot,
    private socketSessionControl: SocketSessionControl
  ) {}

  // operations that can be executed in only one CPU instance without issues with pm2 (ex. setup centralized state doesnt need to be setup in every pm2 instance!)
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

  public async performMultipleInstancesOperations(): Promise<void> {
    await this.clearAllQueues();

    await this.characterMonitor.monitor();

    //! TODO: Load balance NPCs on PM2 instances
    this.npcManager.listenForBehaviorTrigger();

    this.discordBot.initialize();
  }

  private async execOneTimeOperations(): Promise<void> {
    await this.socketSessionControl.clearAllSessions();

    await blueprintManager.loadAllBlueprints();

    await this.npcManager.disableNPCBehaviors();

    await this.characterConnection.resetCharacterAttributes();
    await this.characterFoodConsumption.clearAllFoodConsumption();
    await this.characterBuffActivator.disableAllTemporaryBuffsAllCharacters();
    await this.partyManagement.clearAllParties();

    await this.spellSilence.removeAllSilence();

    await this.characterTextureChange.removeAllTextureChange();

    await this.pathfindingResults.clearAllResults();

    await this.inMemoryHashTable.deleteAll("crafting-recipes");
    await this.inMemoryHashTable.deleteAll("craftable-item-ingredients");
    await this.inMemoryHashTable.deleteAll("load-craftable-items");

    await this.inMemoryHashTable.deleteAll("raids");

    // Firebase-admin setup, that push notification requires.
    PushNotificationHelper.initialize();

    this.heapMonitor.monitor();

    await this.seeder.start();

    this.npcFreezer.init();

    await this.hitTarget.clearAllQueueJobs();

    await this.locker.clear();
  }

  private async clearAllQueues(): Promise<void> {
    await this.pathfindingQueue.clearAllJobs();
    console.log("🧹 BullMQ queues cleared...");
  }
}
