import { RedisManager } from "@providers/database/RedisManager";
import { provideSingleton } from "@providers/inversify/provideSingleton";
@provideSingleton(GridRedisSerializer)
export class GridRedisSerializer {
  constructor(private redisManager: RedisManager) {}

  public async saveMatrixToRedis(map: string, matrix: number[][]): Promise<void> {
    await this.connectToRedisIfNeeded();
    await this.redisManager.client.set(map, JSON.stringify(matrix));
  }

  public async getMatrixFromRedis(map: string): Promise<number[][]> {
    await this.connectToRedisIfNeeded();
    const matrix = await this.redisManager.client.get(map);

    if (!matrix) {
      throw new Error("❌Could not find matrix for map: " + map);
    }

    return JSON.parse(matrix);
  }

  public async updateMatrixOnRedis(map: string, gridX: number, gridY: number, walkable: boolean): Promise<void> {
    await this.connectToRedisIfNeeded();

    const matrix = await this.getMatrixFromRedis(map);

    matrix[gridY][gridX] = walkable ? 0 : 1;

    await this.redisManager.client.set(map, JSON.stringify(matrix));
  }

  private async connectToRedisIfNeeded(): Promise<void> {
    if (!this.redisManager.client) {
      await this.redisManager.connect();
    }
  }
}
