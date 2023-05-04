import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { BattleCycle } from "@providers/battle/BattleCycle";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import SpellCooldown from "@providers/spells/SpellCooldown";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { NamespaceRedisControl, SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterClass, CharacterSocketEvents, ICharacterLogout, ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { CharacterInventory } from "../CharacterInventory";
import { CharacterMonitor } from "../CharacterMonitor";
import { CharacterView } from "../CharacterView";
import { CharacterBuffActivator } from "../characterBuff/CharacterBuffActivator";
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
    private skillIncrease: SkillIncrease,
    private equipmentSlots: EquipmentSlots,
    private characterInventory: CharacterInventory,
    private characterItemContainer: CharacterItemContainer,
    private characterItems: CharacterItems,
    private characterMonitor: CharacterMonitor,
    private specialEffect: SpecialEffect,
    private spellCooldown: SpellCooldown,
    private characterBuff: CharacterBuffActivator
  ) {}

  public onCharacterLogout(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterLogout,
      async (data: ICharacterLogout, character: ICharacter) => {
        this.characterMonitor.unwatch(character);

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

        await this.characterBuff.disableAllBuffs(character);

        await this.specialEffect.clearEffects(character);
        await this.spellCooldown.clearCooldowns(character._id);

        await this.inMemoryHashTable.deleteAll(data.id.toString());

        const spellLeveling = await this.spellLearn.levelingSpells(character._id, character.skills!);

        if (spellLeveling) {
          console.log(`- Spells have been updated in Character: ${character._id}`);
        }

        await this.skillIncrease.increaseMaxManaMaxHealth(character._id);

        const battleCycle = BattleCycle.battleCycles.get(data.id);

        if (battleCycle) {
          await battleCycle.clear();
        }

        const connectedCharacters = await this.socketConnection.getConnectedCharacters();

        console.log("- Total characters connected:", connectedCharacters.length);
      }
    );
  }

  private async temporaryRemoveWeapon(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as string);
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
