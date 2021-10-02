import { ABTest, IABTest } from "@entities/ModuleSystem/ABTestModel";
import { ABTestRepository } from "@repositories/ModuleSystem/abTests/ABTestRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadABTestUseCase)
export class ReadABTestUseCase {
  constructor(private abTestsRepository: ABTestRepository) {}

  public async read(id: string): Promise<IABTest> {
    return await this.abTestsRepository.readOne(ABTest, { _id: id });
  }

  public async readAll(query): Promise<IABTest[]> {
    return await this.abTestsRepository.readAll(ABTest, query);
  }
}
