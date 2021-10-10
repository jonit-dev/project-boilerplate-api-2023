import industries from "@providers/data/industries.json";
import { provide } from "inversify-binding-decorators";

@provide(ReadIndustriesUseCase)
export class ReadIndustriesUseCase {
  public readAll(): string[] {
    return industries;
  }
}
