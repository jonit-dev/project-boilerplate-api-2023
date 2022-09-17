import { CharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { provide } from "inversify-binding-decorators";

import characterTextures from "./data/charactertextures.json";

@provide(CharacterTexturesSeeder)
export class CharacterTexturesSeeder {
  public async seed(): Promise<void> {
    for (const textureData of characterTextures) {
      console.log(`Seeding data for textureKey ${textureData.textureKey} | ${textureData.faction}`);

      const characterTextureFound = await CharacterTexture.exists({
        textureKey: textureData.textureKey,
        faction: textureData.faction,
      });

      if (!characterTextureFound) {
        console.log("Creating new texture");
        const newCharacterTexture = new CharacterTexture(textureData);
        await newCharacterTexture.save();
      } else {
        console.log("Texture already exists. Updating!");
        await CharacterTexture.updateOne(
          { textureKey: textureData.textureKey },
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
