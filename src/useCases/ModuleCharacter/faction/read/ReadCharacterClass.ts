import { CharacterClass, TypeHelper } from "@rpg-engine/shared";

export class ReadCharacterClass {
  public static getPlayingCharacterClasses(): string[] {
    const values = TypeHelper.enumToStringArray(CharacterClass);
    const noneIndex = values.indexOf(CharacterClass.None);
    if (noneIndex > -1) {
      values.splice(noneIndex, 1);
    }
    return values;
  }
}
