import { CharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { provide } from "inversify-binding-decorators";

import characterTextures from "./data/charactertextures.json";

@provide(CharacterTexturesSeeder)
export class CharacterTexturesSeeder {
  public async seed(): Promise<void> {
    const documentsWithFaction = await CharacterTexture.countDocuments({ faction: { $exists: true } });
    if (documentsWithFaction > 0) {
      await CharacterTexture.deleteMany({});
    }

    for (const textureData of characterTextures) {
      const characterTextureFound = await CharacterTexture.exists({
        textureKey: textureData.textureKey,
      });

      if (!characterTextureFound) {
        const newCharacterTexture = new CharacterTexture(textureData);
        await newCharacterTexture.save();
      } else {
        await CharacterTexture.updateOne(
          {
            textureKey: textureData.textureKey,
          },
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
