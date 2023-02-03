import { InMemoryRepository } from "@providers/database/InMemoryRepository";
import { provide } from "inversify-binding-decorators";

@provide(CharacterInMemoryRepository)
export class CharacterInMemoryRepository extends InMemoryRepository {
  constructor(redisManager) {
    super(redisManager);
  }
}
