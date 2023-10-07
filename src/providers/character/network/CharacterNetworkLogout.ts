import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import PartyManagement from "@providers/party/PartyManagement";
import { SkillStatsIncrease } from "@providers/skill/SkillStatsIncrease";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { NamespaceRedisControl } from "@providers/spells/data/types/SpellsBlueprintTypes";
import {
  CharacterClass,
  CharacterSocketEvents,
  ICharacterLogout,
  ItemSubType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { clearCacheForKey } from "speedgoose";
import { CharacterInventory } from "../CharacterInventory";
import { CharacterMonitorQueue } from "../CharacterMonitorQueue";
import { CharacterView } from "../CharacterView";
import { CharacterItemContainer } from "../characterItems/CharacterItemContainer";
import { CharacterItems } from "../characterItems/CharacterItems";

@provide(CharacterNetworkLogout)
export class CharacterNetworkLogout {
  constructor(
    private socketMessagingHelper: SocketMessaging,
    private socketAuth: SocketAuth,
    private socketConnection: SocketConnection,
    private characterView: CharacterView,
    private inMemoryHashTable: InMemoryHashTable,
    private spellLearn: SpellLearn,
    private equipmentSlots: EquipmentSlots,
    private characterInventory: CharacterInventory,
    private characterItemContainer: CharacterItemContainer,
    private characterItems: CharacterItems,
    private characterMonitorQueue: CharacterMonitorQueue,
    private specialEffect: SpecialEffect,
    private socketSessionControl: SocketSessionControl,

    private skillStatsIncrease: SkillStatsIncrease,
    private partyManagement: PartyManagement
  ) {}

  public onCharacterLogout(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterLogout,
      async (data: ICharacterLogout, character: ICharacter) => {
        await this.characterMonitorQueue.unwatchAll(character);

        const nearbyCharacters = await this.characterView.getCharactersInView(character);

        for (const character of nearbyCharacters) {
          this.socketMessagingHelper.sendEventToUser<ICharacterLogout>(
            character.channelId!,
            CharacterSocketEvents.CharacterLogout,
            data
          );
        }

        console.log(`🚪: Character id ${data.id} has disconnected`);

        await this.temporaryRemoveWeapon(data.id);

        const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
        const key: SpellsBlueprint = SpellsBlueprint.DruidShapeshift;

        const keyVeil: SpellsBlueprint = SpellsBlueprint.SorcererVeilofUndeath;

        const hasShapeShift = await this.inMemoryHashTable.has(namespace, key);
        let textureKey: any;
        if (hasShapeShift) {
          textureKey = await this.inMemoryHashTable.get(namespace, key);
        }
        await Character.updateOne(
          { _id: data.id },
          {
            isOnline: false,
            textureKey: textureKey || character.textureKey,
          }
        );

        const hasVeil = await this.inMemoryHashTable.has(namespace, keyVeil);
        let textureKeyVeil: any;
        if (hasVeil) {
          textureKeyVeil = await this.inMemoryHashTable.get(namespace, keyVeil);
        }
        await Character.updateOne(
          { _id: data.id },
          {
            isOnline: false,
            textureKey: textureKeyVeil || character.textureKey,
          }
        );
        await this.socketSessionControl.deleteSession(character._id);

        await this.specialEffect.clearEffects(character);

        await this.inMemoryHashTable.delete("character-max-weights", character._id);

        await this.inMemoryHashTable.deleteAll(data.id.toString());

        await clearCacheForKey(`characterBuffs_${character._id}`);
        await clearCacheForKey(`${character._id}-skills`);

        const spellLeveling = await this.spellLearn.levelingSpells(character._id, character.skills!);

        if (spellLeveling) {
          console.log(`- Spells have been updated in Character: ${character._id} - channel(${character.channelId!})`);
        }

        await this.skillStatsIncrease.increaseMaxManaMaxHealth(character._id);

        await this.leavePartyIfExists(character);

        const connectedCharacters = await this.socketConnection.getConnectedCharacters();

        console.log("- Total characters connected:", connectedCharacters.length);
      }
    );
  }

  private async leavePartyIfExists(character: ICharacter): Promise<void> {
    const party = (await this.partyManagement.getPartyByCharacterId(character._id)) as ICharacterParty;

    if (party) {
      await this.partyManagement.leaveParty(party._id, character, character);
    }
  }

  private async temporaryRemoveWeapon(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character._id, character.equipment as string);
    const leftHandItem = (await Item.findById(equipmentSlots.leftHand).lean()) as IItem;
    const rightHandItem = (await Item.findById(equipmentSlots.rightHand).lean()) as IItem;
    const inventory = (await this.characterInventory.getInventory(character)) as IItem;

    if (
      character.class === CharacterClass.Berserker &&
      leftHandItem?.subType === ItemSubType.Sword &&
      rightHandItem?.subType === ItemSubType.Sword
    ) {
      return;
    }

    if (
      character.class === CharacterClass.Rogue &&
      leftHandItem?.subType === ItemSubType.Dagger &&
      rightHandItem?.subType === ItemSubType.Dagger
    ) {
      return;
    }

    const weaponCombinations = [
      { left: ItemSubType.Sword, right: ItemSubType.Sword },
      { left: ItemSubType.Sword, right: ItemSubType.Dagger },
      { left: ItemSubType.Dagger, right: ItemSubType.Dagger },
      { left: ItemSubType.Dagger, right: ItemSubType.Sword },
    ];

    for (const combination of weaponCombinations) {
      const { left, right } = combination;
      const hasLeftWeapon = leftHandItem?.subType === left;
      const hasRightWeapon = rightHandItem?.subType === right;

      if (hasLeftWeapon && hasRightWeapon) {
        const itemToRemove = leftHandItem?.subType === ItemSubType.Sword ? leftHandItem : rightHandItem;
        const addItemToInventory = await this.characterItemContainer.addItemToContainer(
          itemToRemove,
          character,
          inventory.itemContainer as string
        );
        if (addItemToInventory) {
          const hasItemOnEquipment = await this.characterItems.hasItem(itemToRemove._id, character, "equipment");
          if (hasItemOnEquipment) {
            await this.characterItems.deleteItemFromContainer(itemToRemove._id, character, "equipment");
          }
        }
      }
    }
  }
}
