import { ABTest, IABTest } from "@entities/ModuleSystem/ABTestModel";
import { ABTestRepository } from "@repositories/ModuleSystem/abTests/ABTestRepository";
import { provide } from "inversify-binding-decorators";

import { UpdateABTestDTO } from "../ABTestDTO";

@provide(UpdateABTestUseCase)
export class UpdateABTestUseCase {
  constructor(private abTestsRepository: ABTestRepository) {}

  public async update(id: string, abTestUpdateDTO: UpdateABTestDTO): Promise<IABTest> {
    return await this.abTestsRepository.update(ABTest, id, abTestUpdateDTO);
  }
}
