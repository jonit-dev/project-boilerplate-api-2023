import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ISpell, ISpellRead, IUIShowMessage, SpellSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { spellsBlueprints } from "../data/blueprints/index";

@provide(SpellNetworkReadInfo)
export class SpellNetworkReadInfo {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onGetInfo(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      SpellSocketEvents.LearnedSpellsRead,
      async (_data, character: ICharacter) => {
        const { learnedSpells } = character;

        const skill = await Skill.findOne({
          owner: character.id,
        }).lean();

        if (!learnedSpells || !skill) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Character not found",
            type: "error",
          });
          return false;
        }

        const populatedSpells = learnedSpells.map((spell) => {
          const spellBlueprint = spellsBlueprints[spell];

          if (!spellBlueprint) return spellsBlueprints[0];

          return spellBlueprint as ISpell;
        });

        this.socketMessaging.sendEventToUser<ISpellRead>(character.channelId!, SpellSocketEvents.LearnedSpellsRead, {
          spells: populatedSpells,
          magicLevel: skill.magic.level,
        });
      }
    );
  }
}
