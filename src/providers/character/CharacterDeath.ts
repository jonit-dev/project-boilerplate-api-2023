import { CharacterBuff, ICharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { DROP_EQUIPMENT_CHANCE } from "@providers/constants/DeathConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentSlotTypes } from "@providers/equipment/EquipmentSlots";
import { blueprintManager, entityEffectUse, equipmentSlots } from "@providers/inversify/container";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import {
  AccessoriesBlueprint,
  BodiesBlueprint,
  ContainersBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { Locker } from "@providers/locks/Locker";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { SkillDecrease } from "@providers/skill/SkillDecrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { Time } from "@providers/time/Time";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import {
  BattleSocketEvents,
  CharacterBuffType,
  IBattleDeath,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _, { random } from "lodash";
import { Types } from "mongoose";
import { CharacterDeathCalculator } from "./CharacterDeathCalculator";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterTarget } from "./CharacterTarget";
import { CharacterBuffActivator } from "./characterBuff/CharacterBuffActivator";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterWeight } from "./weight/CharacterWeight";

export const DROPPABLE_EQUIPMENT = [
  "head",
  "neck",
  "leftHand",
  "rightHand",
  "ring",
  "legs",
  "boot",
  "accessory",
  "armor",
];

@provide(CharacterDeath)
export class CharacterDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTarget: CharacterTarget,
    private npcTarget: NPCTarget,
    private characterInventory: CharacterInventory,
    private itemOwnership: ItemOwnership,
    private characterWeight: CharacterWeight,
    private skillDecrease: SkillDecrease,
    private characterDeathCalculator: CharacterDeathCalculator,
    private characterItemContainer: CharacterItemContainer,
    private inMemoryHashTable: InMemoryHashTable,
    private characterBuffActivator: CharacterBuffActivator,
    private locker: Locker,
    private time: Time,
    private newRelic: NewRelic
  ) {}

  @TrackNewRelicTransaction()
  public async handleCharacterDeath(killer: INPC | ICharacter | null, character: ICharacter): Promise<void> {
    try {
      await this.time.waitForMilliseconds(random(0, 50));

      const canProceed = await this.locker.lock(`character-death-${character.id}`);

      if (!canProceed) {
        return;
      }

      if (character.health > 0) {
        // if by any reason the char is not dead, make sure it is.
        await Character.updateOne({ _id: character._id }, { $set: { health: 0 } });
        character.health = 0;
        character.isAlive = false;
      }

      if (killer) {
        await this.clearAttackerTarget(killer);
      }

      await entityEffectUse.clearAllEntityEffects(character);

      const characterDeathData: IBattleDeath = {
        id: character.id,
        type: "Character",
      };
      this.socketMessaging.sendEventToUser(character.channelId!, BattleSocketEvents.BattleDeath, characterDeathData);

      // communicate all players around that character is dead

      await this.socketMessaging.sendEventToCharactersAroundCharacter<IBattleDeath>(
        character,
        BattleSocketEvents.BattleDeath,
        characterDeathData
      );

      const amuletOfDeath = await equipmentSlots.hasItemByKeyOnSlot(
        character,
        AccessoriesBlueprint.AmuletOfDeath,
        "neck"
      );

      // generate character's body
      const characterBody = await this.generateCharacterBody(character);

      if (!amuletOfDeath) {
        // drop equipped items and backpack items
        await this.dropCharacterItemsOnBody(character, characterBody, character.equipment);

        const deathPenalty = await this.skillDecrease.deathPenalty(character);
        if (deathPenalty) {
          // Set timeout to not overwrite the msg "You are Died"
          setTimeout(() => {
            this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
              message: "You lost some XP and skill points.",
              type: "info",
            });
          }, 2000);
        }
      } else {
        setTimeout(() => {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Your Amulet of Death protected your XP and skill points.",
            type: "info",
          });
        }, 2000);

        await equipmentSlots.removeItemFromSlot(character, AccessoriesBlueprint.AmuletOfDeath, "neck");
      }

      this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.Characters, "Death", 1);

      await this.inMemoryHashTable.delete("character-weapon", character._id);
      await this.inMemoryHashTable.delete("character-max-weights", character._id);
      await this.inMemoryHashTable.delete("inventory-weight", character._id);
      await this.inMemoryHashTable.delete("equipment-weight", character._id);

      await this.characterWeight.updateCharacterWeight(character);
    } catch {
      await this.locker.unlock(`character-death-${character.id}`);
    } finally {
      await this.respawnCharacter(character);
    }
  }

  @TrackNewRelicTransaction()
  public async generateCharacterBody(character: ICharacter): Promise<IItem> {
    const blueprintData = await blueprintManager.getBlueprint<IItem>("items", BodiesBlueprint.CharacterBody);

    const charBody = new Item({
      ...blueprintData,
      bodyFromId: character.id,
      name: `${character.name}'s body`,
      scene: character.scene,
      texturePath: `${character.textureKey}/death/0.png`,
      x: character.x,
      y: character.y,
    });

    await charBody.save();

    return charBody;
  }

  @TrackNewRelicTransaction()
  public async respawnCharacter(character: ICharacter): Promise<void> {
    await Character.updateOne(
      { _id: character._id },
      {
        $set: {
          health: character.maxHealth,
          mana: character.maxMana,
          x: character.initialX,
          y: character.initialY,
          scene: character.initialScene,
          appliedEntityEffects: [],
        },
      }
    );

    await this.locker.unlock(`character-death-${character.id}`);
  }

  private async clearAttackerTarget(attacker: ICharacter | INPC): Promise<void> {
    if (attacker.type === "Character") {
      // clear killer's target
      await this.characterTarget.clearTarget(attacker as ICharacter);
    }

    if (attacker.type === "NPC") {
      await this.npcTarget.clearTarget(attacker as INPC);
    }
  }

  private async dropCharacterItemsOnBody(
    character: ICharacter,
    characterBody: IItem,
    equipmentId: Types.ObjectId | undefined
  ): Promise<void> {
    if (!equipmentId) {
      return;
    }

    const equipment = (await Equipment.findById(character.equipment).cacheQuery({
      cacheKey: `${character._id}-equipment`,
    })) as IEquipment;

    equipment.inventory = (await this.characterInventory.getInventory(character)) as unknown as IItem;

    if (!equipment.inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you don't have an inventory");
      return;
    }

    if (!equipment) {
      throw new Error(`No equipment found for id ${equipmentId}`);
    }

    // get item container associated with characterBody
    const bodyContainer = await ItemContainer.findById(characterBody.itemContainer);

    if (!bodyContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${characterBody.key}`);
    }

    // drop backpack
    const inventory = equipment.inventory as unknown as IItem;

    if (inventory) {
      await this.dropInventory(character, bodyContainer, inventory);
    }

    // there's a chance of dropping any of the equipped items
    await this.dropEquippedItemOnBody(character, bodyContainer, equipment);

    await this.clearAllInventoryItems(inventory as unknown as string, character);
  }

  private async clearAllInventoryItems(inventoryId: string, character: ICharacter): Promise<void> {
    const inventoryItem = await Item.findById(inventoryId).lean();

    await this.clearItem(character, inventoryItem as unknown as IItem);

    const inventoryContainer = await ItemContainer.findById(inventoryItem?.itemContainer).lean();

    const bodySlots = inventoryContainer?.slots as { [key: string]: IItem };

    for (const slotItem of Object.values(bodySlots)) {
      await this.clearItem(character, slotItem);
    }
  }

  private async dropInventory(character: ICharacter, bodyContainer: IItemContainer, inventory: IItem): Promise<void> {
    const n = _.random(0, 100);
    let isDeadBodyLootable = false;

    const skills = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as unknown as ISkill as ISkill;

    const dropInventoryChance = this.characterDeathCalculator.calculateInventoryDropChance(skills);

    if (n <= dropInventoryChance) {
      let item = (await Item.findById(inventory._id)) as IItem;

      item.itemContainer &&
        (await this.inMemoryHashTable.delete("container-all-items", item.itemContainer.toString()!));

      item = await this.clearItem(character, item);

      // now that the slot is clear, lets drop the item on the body
      await this.characterItemContainer.addItemToContainer(item, character, bodyContainer._id, {
        shouldAddOwnership: false,
        shouldAddAsCarriedItem: false,
      });

      if (!isDeadBodyLootable) {
        isDeadBodyLootable = true;
        await Item.updateOne({ _id: bodyContainer.parentItem }, { $set: { isDeadBodyLootable: true } });
      }

      setTimeout(() => {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "You dropped your inventory.",
          type: "info",
        });
      }, 4000);

      await this.characterInventory.generateNewInventory(character, ContainersBlueprint.Bag, true);
    }
  }

  private async dropEquippedItemOnBody(
    character: ICharacter,
    bodyContainer: IItemContainer,
    equipment: IEquipment
  ): Promise<void> {
    let isDeadBodyLootable = false;

    for (const slot of DROPPABLE_EQUIPMENT) {
      const itemId = equipment[slot];

      if (!itemId) continue;

      let item = (await Item.findById(itemId)) as IItem;

      if (!item) {
        throw new Error(`Error fetching item with id ${itemId}`);
      }

      const n = _.random(0, 100);

      if (n <= DROP_EQUIPMENT_CHANCE) {
        const removeEquipmentFromSlot = await equipmentSlots.removeItemFromSlot(
          character,
          item.key,
          slot as EquipmentSlotTypes
        );

        if (!removeEquipmentFromSlot) {
          return;
        }

        item = await this.clearItem(character, item);

        // now that the slot is clear, lets drop the item on the body
        await this.characterItemContainer.addItemToContainer(item, character, bodyContainer._id, {
          shouldAddOwnership: false,
          shouldAddAsCarriedItem: false,
        });

        if (!isDeadBodyLootable) {
          isDeadBodyLootable = true;
          await Item.updateOne({ _id: bodyContainer.parentItem }, { $set: { isDeadBodyLootable: true } });
        }
      }
    }
  }

  private async clearItem(character: ICharacter, item: IItem): Promise<IItem> {
    const itemKey = item.key;
    const buff = (await CharacterBuff.findOne({ owner: character._id, itemKey })
      .lean()
      .select("_id type")) as ICharacterBuff;

    if (buff) {
      const disableBuff = await this.characterBuffActivator.disableBuff(
        character,
        buff._id,
        buff.type as CharacterBuffType,
        true
      );

      if (!disableBuff) {
        throw new Error(`Error disabling buff ${buff._id}`);
      }
    }

    await Item.updateOne(
      {
        _id: item._id,
      },
      {
        $unset: {
          x: "",
          y: "",
          owner: "",
          scene: "",
          tiledId: "",
        },
      }
    );

    await this.itemOwnership.removeItemOwnership(item);

    return item;
  }
}
