import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterPvPKillLog } from "@entities/ModuleCharacter/CharacterPvPKillLogModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSkullType, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterSkull)
export class CharacterSkull {
  constructor(
    private readonly inMemoryHashTable: InMemoryHashTable,
    private readonly socketMessaging: SocketMessaging
  ) {}

  public checkForUnjustifiedAttack(character: ICharacter, target: ICharacter): boolean {
    return target.hasSkull !== true && target.faction === character.faction;
  }

  @TrackNewRelicTransaction()
  public async updateWhiteSkull(characterId: string, targetId: string): Promise<void> {
    try {
      const character = await Character.findOne({ _id: characterId });
      if (!character) {
        return;
      }

      // Only checking for white skull, if yellow + red skull => skip this
      if (character.hasSkull && character.skullType !== CharacterSkullType.WhiteSkull) {
        return;
      }

      const namespace = `last_pvp:${character._id}`;
      if (!character.hasSkull) {
        await this.setSkull(character, CharacterSkullType.WhiteSkull);
      } else if (character.skullType === CharacterSkullType.WhiteSkull) {
        // Check if character attack another player
        const lastTargetId = await this.checkLastPvPTargetId(character._id.toString());
        if (lastTargetId !== targetId) {
          await this.setSkull(character, CharacterSkullType.WhiteSkull);
        }
      }
      // Set the last attack target
      await this.inMemoryHashTable.set(namespace, character._id.toString(), targetId);
      await this.inMemoryHashTable.expire(namespace, 15 * 60, "NX");
    } catch (err) {
      console.error(`An error occurred while trying to update skull to character ${characterId}`, err);
    }
  }

  private getSkullText(skull: string | undefined): string {
    if (!skull) return "";
    switch (skull as CharacterSkullType) {
      case CharacterSkullType.WhiteSkull:
        return "You got a White Skull. It expires in 15 mins.";
      case CharacterSkullType.YellowSkull:
        return "You got a Yellow Skull. It expires in 1 week.";
      case CharacterSkullType.RedSkull:
        return "You got a Red Skull. It expires in 2 weeks.";
      default:
        throw new Error("Skull is invalid");
    }
  }

  private async sendSkullEventToUser(character: ICharacter): Promise<void> {
    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      hasSkull: true,
      skullType: character.skullType as CharacterSkullType,
    };

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      CharacterSocketEvents.AttributeChanged,
      payload,
      true
    );
    this.socketMessaging.sendMessageToCharacter(character, this.getSkullText(character.skullType));
  }

  private async checkLastPvPTargetId(characterId: string): Promise<string | null> {
    const namespace = `last_pvp:${characterId}`;
    const lastTargetId = await this.inMemoryHashTable.get(namespace, characterId);
    if (typeof lastTargetId === "string") {
      return lastTargetId as string;
    }

    return null;
  }

  private async setSkull(character: ICharacter, skullType: CharacterSkullType): Promise<void> {
    let timeExpired = new Date();
    switch (skullType) {
      case CharacterSkullType.WhiteSkull:
        timeExpired = new Date(Date.now() + 15 * 60 * 1000);

        break;
      case CharacterSkullType.YellowSkull:
        timeExpired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        break;
      case CharacterSkullType.RedSkull:
        timeExpired = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        break;
    }
    character.hasSkull = true;
    character.skullType = skullType;
    character.skullExpiredAt = timeExpired;
    await character.save();
    await this.sendSkullEventToUser(character);
  }

  public async updateSkullAfterKill(characterId: string): Promise<void> {
    const character = await Character.findById(characterId);
    if (!character) {
      return;
    }

    if (character.hasSkull && character.skullType === CharacterSkullType.RedSkull) {
      // always reset timer when kill with red skull
      await this.setSkull(character, CharacterSkullType.RedSkull);
      return;
    }

    // check if character upgrage to red skull
    const totalKillCount10Days = await CharacterPvPKillLog.countDocuments({
      killer: characterId,
      isJustify: false,
      createdAt: {
        $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    });
    if (totalKillCount10Days > 3) {
      // set red skull when total kill in 10 days > 3
      await this.setSkull(character, CharacterSkullType.RedSkull);
    } else {
      const totalKillCount7Days = await CharacterPvPKillLog.countDocuments({
        killer: characterId,
        isJustify: false,
        createdAt: {
          $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      });
      // if total kill > 1 => set Yellow skull and reset timer
      if (totalKillCount7Days > 1) {
        await this.setSkull(character, CharacterSkullType.YellowSkull);
      }
    }
  }
}
