import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { EntityPosition, IStorableEntity } from "./EntityPosition";

@provide(EntityPositionDocMiddleware)
export class EntityPositionDocMiddleware {
  constructor(private entityPosition: EntityPosition) {}

  public async applyCharacterMiddleware(doc: ICharacter): Promise<ICharacter> {
    if (!doc) return doc;

    if (!doc.x && !doc.y && !doc.scene && !doc.direction && !doc.lastMovement) return doc;

    const redisPosition = await this.entityPosition.getEntityPosition(doc as IStorableEntity, "characters");

    if (redisPosition) {
      doc.x = redisPosition.x;
      doc.y = redisPosition.y;
      doc.scene = redisPosition.scene;

      if (redisPosition.direction) {
        doc.direction = redisPosition.direction;
      }

      if (redisPosition.lastMovement) {
        doc.lastMovement = redisPosition.lastMovement;
      }
    }

    return doc;
  }
}
