import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { provide } from "inversify-binding-decorators";

@provide(InterpolationParser)
export class InterpolationParser {
  public parse(text: string, character?: ICharacter, npc?: INPC): string | undefined {
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
        console.log("Failed to find target or key for interpolation: ", match);
        return;
      }
      console.log(target);

      const variable = key.replace(/{{|}}/g, "").toLocaleLowerCase();
      const value = target[variable];

      console.log(value);

      if (!value) {
        throw new Error(`Variable ${variable} not found in character`);
      }

      text = text.replace(match, value);
    }

    return text;
  }
}
