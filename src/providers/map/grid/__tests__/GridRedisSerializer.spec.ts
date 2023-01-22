import { RedisManager } from "@providers/database/RedisManager";
import { container } from "@providers/inversify/container";
import { GridRedisSerializer } from "../GridRedisSerializer";

describe("GridRedisSerializer", () => {
  let gridRedisSerializer: GridRedisSerializer;
  let redisManager: RedisManager;
  let matrix: number[][];

  beforeAll(async () => {
    gridRedisSerializer = container.get(GridRedisSerializer);
    redisManager = container.get(RedisManager);

    await redisManager.connect();
  });

  beforeEach(async () => {
    matrix = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];

    await gridRedisSerializer.saveMatrixToRedis("test", matrix);
  });

  it("properly saves a matrix to redis and retrieves its content", async () => {
    const matrixFromRedis = await gridRedisSerializer.getMatrixFromRedis("test");

    expect(matrixFromRedis).toEqual(matrix);
  });
});
