import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(PathfindingResults)
export class PathfindingResults {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setResult(jobId: string, result: number[][]): Promise<void> {
    await this.inMemoryHashTable.set("pathfinding-results", jobId, result);
  }

  public async getResult(jobId: string): Promise<number[][]> {
    return (await this.inMemoryHashTable.get("pathfinding-results", jobId)) as number[][];
  }

  public async deleteResult(jobId: string): Promise<void> {
    await this.inMemoryHashTable.delete("pathfinding-results", jobId);
  }

  public async clearAllResults(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("pathfinding-results");
  }
}
