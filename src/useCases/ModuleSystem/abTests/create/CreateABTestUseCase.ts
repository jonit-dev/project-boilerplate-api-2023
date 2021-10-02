import { ABTest, IABTest } from "@entities/ModuleSystem/ABTestModel";
import { ABTestRepository } from "@repositories/ModuleSystem/abTests/ABTestRepository";
import { provide } from "inversify-binding-decorators";

import { CreateABTestDTO } from "../ABTestDTO";

@provide(CreateABTestUseCase)
export class CreateABTestUseCase {
  constructor(private abTestsRepository: ABTestRepository) {}

  public async create(createABTestDTO: CreateABTestDTO): Promise<IABTest> {
    const createdABTest = await this.abTestsRepository.create(ABTest, createABTestDTO, null, ["name", "slug"], null);

    return createdABTest;
  }
}
