import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { MapTransition } from "@providers/map/MapTransition";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

function formatPlayerName(playerName: string): string {
  let formattedName = playerName.trim();
  formattedName = formattedName.replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
  return formattedName;
}

@provide(AdminCommands)
export class AdminCommands {
  constructor(private socketMessaging: SocketMessaging, private mapTransition: MapTransition) {}

  public async handleBanCommand(params: string[], character: ICharacter): Promise<void> {
    if (params.length < 2) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid ban command format");
      return;
    }

    const targetCharacterName = params.slice(0, -1).join(" ");
    const banDuration = parseInt(params[params.length - 1], 10);

    if (isNaN(banDuration)) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid ban duration");
      return;
    }

    const targetPlayer = await this.getPlayerByName(targetCharacterName);

    if (!targetPlayer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, `Player '${targetCharacterName}' not found`);
      return;
    }

    await Character.updateOne(
      {
        _id: targetPlayer._id,
      },
      {
        $set: {
          isBanned: true,
          banRemovalDate: new Date(Date.now() + banDuration * 24 * 60 * 60 * 1000),
        },
      }
    );

    this.socketMessaging.sendMessageToCharacter(targetPlayer, `You have been banned for ${banDuration} days`);
    this.socketMessaging.sendEventToUser(targetPlayer.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
      reason: "You have been banned",
    });

    this.socketMessaging.sendMessageToCharacter(
      character,
      `Player '${targetCharacterName}' has been banned for ${banDuration} days`
    );
  }

  public async handleTeleportCommand(params: string[], character: ICharacter): Promise<void> {
    if (params.length < 3) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid teleport command format");
      return;
    }

    const targetCharacterName = params[0];
    const newX = parseInt(params[1]);
    const newY = parseInt(params[2]);
    const newScene = params[3];

    if (!newScene) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid target map.");
      return;
    }

    if (isNaN(newX) || isNaN(newY)) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid coordinates");
      return;
    }

    const targetPlayer = (await this.getPlayerByName(targetCharacterName)) as ICharacter;

    const hasValidation = this.basicTargetCharacterValidation(character, targetPlayer, targetCharacterName);

    if (!hasValidation) {
      return;
    }

    this.socketMessaging.sendMessageToCharacter(
      character,
      `Player '${targetCharacterName}' has been teleported to coordinates x: ${newX}, y: ${newY}`
    );

    await this.mapTransition.changeCharacterScene(targetPlayer, {
      map: newScene,
      gridX: ToGridX(newX),
      gridY: ToGridY(newY),
    });
  }

  public async handleSendTempleCommand(params: string[], character: ICharacter): Promise<void> {
    if (params.length < 1) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid sendtemple command format");
      return;
    }

    const playerName = params.join(" ");
    const targetCharacter = (await this.getPlayerByName(playerName)) as ICharacter;

    const hasValidation = this.basicTargetCharacterValidation(character, targetCharacter, playerName);

    if (!hasValidation) {
      return;
    }

    this.socketMessaging.sendMessageToCharacter(character, `Player '${playerName}' has been teleported to the temple`);

    const mapTransition = container.get(MapTransition);

    await mapTransition.changeCharacterScene(targetCharacter, {
      map: targetCharacter.initialScene,
      gridX: ToGridX(targetCharacter.initialX),
      gridY: ToGridY(targetCharacter.initialY),
    });
  }

  public async handleGotoCommand(params: string[], character: ICharacter): Promise<void> {
    if (params.length < 1) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid goto command format");
      return;
    }

    const characterName = params.join(" ");
    const targetCharacter = (await this.getPlayerByName(characterName)) as ICharacter;

    const hasValidation = this.basicTargetCharacterValidation(character, targetCharacter, characterName);

    if (!hasValidation) {
      return;
    }

    this.socketMessaging.sendMessageToCharacter(character, `Teleported to player '${characterName}' location`);
    const mapTransition = container.get(MapTransition);

    await mapTransition.changeCharacterScene(character, {
      map: character.initialScene,
      gridX: ToGridX(targetCharacter.x),
      gridY: ToGridY(targetCharacter.y),
    });
  }

  public async handleGetPosCommand(params: string[], character: ICharacter): Promise<void> {
    if (params.length < 1) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid goto command format");
      return;
    }

    const playerName = params.join(" ");
    const targetCharacter = (await this.getPlayerByName(playerName)) as ICharacter;

    const hasValidation = this.basicTargetCharacterValidation(character, targetCharacter, playerName);

    if (!hasValidation) {
      return;
    }

    this.socketMessaging.sendMessageToCharacter(
      character,
      `Coordinates of player '${playerName}': x = ${targetCharacter.x || 0}, y = ${targetCharacter.y || 0}`
    );
  }

  public async handleSummonCommand(params: string[], character: ICharacter): Promise<void> {
    if (params.length < 1) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Invalid summon command format");
      return;
    }

    const characterName = params.join(" ");
    const targetCharacter = (await this.getPlayerByName(characterName)) as ICharacter;

    const hasValidation = this.basicTargetCharacterValidation(character, targetCharacter, characterName);

    if (!hasValidation) {
      return;
    }

    this.socketMessaging.sendMessageToCharacter(character, `Summoned player '${characterName}' to your location`);
    this.socketMessaging.sendMessageToCharacter(targetCharacter, "You have been summoned");

    await this.mapTransition.changeCharacterScene(targetCharacter, {
      map: targetCharacter.initialScene,
      gridX: ToGridX(character.x),
      gridY: ToGridY(character.y),
    });
  }

  public async handleOnlineCommand(character: ICharacter): Promise<void> {
    const onlineCharacters = await Character.find({ isOnline: true });
    const onlineCount = onlineCharacters.length;

    if (onlineCount === 0) {
      this.socketMessaging.sendMessageToCharacter(character, "There are no players online");
    } else {
      const onlineCharacterNames = onlineCharacters.map((char) => char.name).join(", ");
      const message = `Players online (${onlineCount}): ${onlineCharacterNames}`;

      this.socketMessaging.sendMessageToCharacter(character, message);
    }
  }

  private basicTargetCharacterValidation(
    character: ICharacter,
    targetCharacter: ICharacter,
    targetCharacterName: string
  ): boolean {
    if (!targetCharacter) {
      this.socketMessaging.sendErrorMessageToCharacter(character, `Player '${targetCharacterName}' not found`);
      return false;
    }

    if (!targetCharacter.isOnline) {
      this.socketMessaging.sendErrorMessageToCharacter(character, `Player '${targetCharacter.name}' is not online`);
      return false;
    }

    return true;
  }

  private async getPlayerByName(playerName: string): Promise<ICharacter | null> {
    const formattedPlayerName = formatPlayerName(playerName);
    const player = (await Character.findOne({
      name: new RegExp(`^${formattedPlayerName}$`, "i"),
    }).lean()) as ICharacter;
    return player;
  }
}
