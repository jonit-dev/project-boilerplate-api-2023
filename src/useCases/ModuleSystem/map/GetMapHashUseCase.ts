import { STATIC_PATH } from "@providers/constants/PathConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { provide } from "inversify-binding-decorators";
import md5File from "md5-file";

@provide(GetMapHashUseCase)
export class GetMapHashUseCase {
  public execute(mapName: string): object {
    try {
      const hash = md5File.sync(`${STATIC_PATH}/maps/${mapName}.json`);
      return { hash };
    } catch (error: any | Error) {
      throw new BadRequestError(error.message);
    }
  }
}
