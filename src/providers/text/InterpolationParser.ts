import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(InterpolationParser)
export class InterpolationParser {
  public parseDialog(text: string, character: ICharacter, npc: INPC): string {
    const regex = /{{(.*?)}}/g;

    const matches = text.match(regex);

    if (!matches) {
      return text;
    }

    for (const match of matches) {
      let target;
      let key;
      if (match.includes("char")) {
        key = match.replace("char", "");
        target = character;
      }
      if (match.includes("npc")) {
        key = match.replace("npc", "");
        target = npc;
      }

      if (!target || !key) {
        console.log(`Failed to find target or key for interpolation: ${match}`);
        continue;
      }

      const variable = _.camelCase(key.replace(/{{|}}/g, "").replace(".", ""));

      const value = target[variable];

      if (!value) {
        console.log(`Variable ${variable} not found in character`);
        continue;
      }

      // replace all matches with the value

      text = text.replace(match, value);
    }
    return text;
  }
}
