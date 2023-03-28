import { provide } from "inversify-binding-decorators";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";

@provide(RedisCleanup)
export class RedisCleanup {
  constructor(private specialEffect: SpecialEffect) {}

  public async cleanup(): Promise<void> {
    await this.specialEffect.cleanup();
  }
}
