import { CharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { provide } from "inversify-binding-decorators";

import characterTextures from "./data/charactertextures.json";

@provide(CharacterTexturesSeeder)
export class CharacterTexturesSeeder {
  public async seed(): Promise<void> {
    for (const textureData of characterTextures) {
      const characterTextureFound = await CharacterTexture.exists({
        textureKey: textureData.textureKey,
        faction: textureData.faction,
      });

      if (!characterTextureFound) {
        const newCharacterTexture = new CharacterTexture(textureData);
        await newCharacterTexture.save();
      } else {
        await CharacterTexture.updateOne(
          { textureKey: textureData.textureKey, faction: textureData.faction },
          {
            $set: {
              ...textureData,
            },
          },
          {
            upsert: true,
          }
        );
      }
    }
  }
}
