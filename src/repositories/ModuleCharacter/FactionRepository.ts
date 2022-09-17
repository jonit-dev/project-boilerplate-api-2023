import { CharacterTexture, ICharacterTexture } from "@entities/ModuleCharacter/CharacterTextureModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { provide } from "inversify-binding-decorators";

@provide(FactionRepository)
export class FactionRepository extends CRUD {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }

  public async readSprites(faction: string, race: string): Promise<ICharacterTexture[]> {
    return await this.readAll(CharacterTexture, { faction: faction, race: race }, false, null, true);
  }

  public async exists(faction: string, race: string, textureKey: string): Promise<boolean> {
    const textures = await this.readAll(
      CharacterTexture,
      { faction: faction, race: race, textureKey: textureKey },
      false,
      null,
      true
    );
    return textures.length > 0;
  }
}
