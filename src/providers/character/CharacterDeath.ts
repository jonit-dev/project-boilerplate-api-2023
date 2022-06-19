import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { BodiesBlueprint } from "@providers/item/data/types/blueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterDeath)
export class CharacterDeath {
  constructor(private socketMessaging: SocketMessaging) {}

  public async handleCharacterDeath(character: ICharacter): Promise<void> {
    console.log(`💀 Character ${character.name} is dead 💀`);

    // send event to the character that is dead

    this.socketMessaging.sendEventToUser<IBattleDeath>(character.channelId!, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });
    // communicate all players around that character is dead

    await this.socketMessaging.sendMessageToCloseCharacters<IBattleDeath>(character, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    // generate character's body

    await this.generateCharacterBody(character);

    // Restart health and X,Y after death.
    await this.respawnCharacter(character);

    // finally, force disconnect character that is dead.
    this.socketMessaging.sendEventToUser(character.channelId!, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    // TODO: Add death penalty here.
  }

  public async generateCharacterBody(character: ICharacter): Promise<void> {
    const blueprintData = itemsBlueprintIndex[BodiesBlueprint.CharacterBody];

    const charBody = new Item({
      ...blueprintData,
      owner: character.id,
      name: `${character.name}'s body`,
      scene: character.scene,
      x: character.x,
      y: character.y,
    });

    await charBody.save();
  }

  public async respawnCharacter(character: ICharacter): Promise<void> {
    character.health = character.maxHealth;
    character.mana = character.maxMana;
    character.x = character.initialX;
    character.y = character.initialY;
    character.scene = character.initialScene;
    await character.save();
  }
}
