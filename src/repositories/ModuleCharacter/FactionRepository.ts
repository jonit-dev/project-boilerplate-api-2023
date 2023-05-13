import characterTextures from "@providers/characterTextures/data/charactertextures.json";
import { ICharacterTexture } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(FactionRepository)
export class FactionRepository {
  constructor() {}

  public readSprites(characterClass: string, race: string): ICharacterTexture[] {
    return characterTextures.filter(
      (texture: ICharacterTexture) => texture.race === race && texture.class === characterClass
    );
  }

  public exists(race: string, textureKey: string): boolean {
    const textures = characterTextures.find(
      (texture: ICharacterTexture) => texture.race === race && texture.textureKey === textureKey
    );
    return !!textures;
  }
}
