import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";

import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { blueprintManager } from "@providers/inversify/container";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { Locker } from "@providers/locks/Locker";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { BattleSocketEvents, CharacterPartyBenefits, IBattleDeath, INPCLoot } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { NPCExperience } from "./NPCExperience/NPCExperience";
import { NPCFreezer } from "./NPCFreezer";
import { NPCLoot } from "./NPCLoot";
import { NPCSpawn } from "./NPCSpawn";
import { NPCTarget } from "./movement/NPCTarget";

@provide(NPCDeath)
export class NPCDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private npcTarget: NPCTarget,
    private itemOwnership: ItemOwnership,
    private npcFreezer: NPCFreezer,
    private npcSpawn: NPCSpawn,
    private npcExperience: NPCExperience,
    private locker: Locker,
    private newRelic: NewRelic,
    private npcLoot: NPCLoot
  ) {}

  @TrackNewRelicTransaction()
  public async handleNPCDeath(npc: INPC): Promise<void> {
    await this.npcFreezer.freezeNPC(npc, "NPCDeath");
    const hasLocked = await this.locker.lock(`npc-death-${npc._id}`);
    if (!hasLocked) {
      return;
    }
    try {
      console.log("NPCDeath for npc: ", npc.key);
      if (npc.health !== 0) {
        const setHealthToZero = NPC.updateOne({ _id: npc._id }, { $set: { health: 0 } });
        npc.health = 0;
        npc.isAlive = false;
        const saveNPC = npc.save();
        await Promise.all([setHealthToZero, saveNPC]);
      }
      const npcBody = await this.generateNPCBody(npc);
      if (!npcBody) {
        return;
      }
      const notifyCharactersOfNPCDeath = await this.notifyCharactersOfNPCDeath(npc);
      const npcWithSkills = await this.getNPCWithSkills(npc);
      const goldLoot = this.npcLoot.getGoldLoot(npcWithSkills);
      const totalDropRatioFromParty = await this.calculateTotalDropRatioFromParty(npc);
      const npcLoots: INPCLoot[] = (npc.loots as unknown as INPCLoot[]).map((loot) => ({
        itemBlueprintKey: loot.itemBlueprintKey,
        chance: loot.chance + totalDropRatioFromParty || 0,
        quantityRange: loot.quantityRange || undefined,
      }));
      const addLootToNPCBody = this.npcLoot.addLootToNPCBody(npcBody, [...npcLoots, goldLoot], npc.isGiantForm);
      const removeItemOwnership = this.itemOwnership.removeItemOwnership(npcBody.id);
      const clearNPCBehavior = this.clearNPCBehavior(npc);
      const updateNPCAfterDeath = this.updateNPCAfterDeath(npcWithSkills);
      const releaseXP = this.npcExperience.releaseXP(npc as INPC);

      this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.NPCs, "Death", 1);

      await Promise.all([
        notifyCharactersOfNPCDeath,
        npcWithSkills,
        goldLoot,
        totalDropRatioFromParty,
        addLootToNPCBody,
        removeItemOwnership,
        clearNPCBehavior,
        updateNPCAfterDeath,
        releaseXP,
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  private async notifyCharactersOfNPCDeath(npc: INPC): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

    const notifications = nearbyCharacters.map((nearbyCharacter) =>
      this.socketMessaging.sendEventToUser<IBattleDeath>(nearbyCharacter.channelId!, BattleSocketEvents.BattleDeath, {
        id: npc.id,
        type: "NPC",
      })
    );

    await Promise.all(notifications);
  }

  private async getNPCWithSkills(npc: INPC): Promise<INPC> {
    const npcFound = (await NPC.findById(npc._id).lean({
      virtuals: true,
      defaults: true,
    })) as INPC;

    if (!npcFound) {
      throw new Error(`NPC not found with id ${npc._id}`);
    }

    const npcSkills = (await Skill.findOne({
      _id: npcFound.skills,
      owner: npcFound._id,
    })
      .lean({
        virtuals: true,
        defaults: true,
      })
      .cacheQuery({
        cacheKey: `${npc._id}-skills`,
      })) as ISkill;

    npcFound.skills = npcSkills;

    return npcFound;
  }

  private async updateNPCAfterDeath(npc: INPC): Promise<void> {
    const skills = npc.skills as ISkill;

    const strengthLevel = skills.strength.level;

    const nextSpawnTime = this.npcSpawn.calculateSpawnTime(strengthLevel);
    const currentMovementType = npc.originalMovementType;

    await NPC.updateOne(
      { _id: npc.id, scene: npc.scene },
      {
        $set: {
          health: 0,
          nextSpawnTime,
          currentMovementType: currentMovementType,
          appliedEntityEffects: undefined,
          isBehaviorEnabled: false,
        },
      }
    );
  }

  @TrackNewRelicTransaction()
  public async generateNPCBody(npc: INPC): Promise<IItem | undefined> {
    const hasLock = await this.locker.lock(`npc-body-generation-${npc._id}`);

    if (!hasLock) {
      return;
    }

    const blueprintData = await blueprintManager.getBlueprint<IItem>("items", "npc-body" as AvailableBlueprints);
    const npcBody = new Item({
      ...blueprintData, // base body props
      key: `${npc.key}-body`,
      bodyFromId: npc.id,
      texturePath: `${npc.textureKey}/death/0.png`,
      textureKey: npc.textureKey,
      name: `${npc.name}'s body`,
      description: `You see ${npc.name}'s body.`,
      scene: npc.scene,
      x: npc.x,
      y: npc.y,
    });

    return await npcBody.save();
  }

  private async clearNPCBehavior(npc: INPC): Promise<void> {
    await this.npcTarget.clearTarget(npc);
  }

  private async calculateTotalDropRatioFromParty(npc: INPC): Promise<number> {
    let totalDropRatio = 0;
    let partyIds = new Set<Types.ObjectId>();
    if (npc.xpToRelease) {
      partyIds = new Set(npc.xpToRelease.filter((xp) => xp.partyId !== null).map((xp) => xp.partyId));
    }
    if (partyIds.size === 0) {
      return 0;
    }
    for (const partyId of partyIds) {
      totalDropRatio += await this.getPartyAndCalculateDropRatio(partyId);
    }
    return totalDropRatio || 0;
  }

  private async getPartyAndCalculateDropRatio(partyId: Types.ObjectId): Promise<number> {
    const party = (await CharacterParty.findById(partyId).lean().select("benefits")) as ICharacterParty;
    if (party?.benefits) {
      const dropRatioBenefit = party.benefits.find((benefits) => benefits.benefit === CharacterPartyBenefits.DropRatio);
      return dropRatioBenefit?.value || 0;
    }
    return 0;
  }
}
