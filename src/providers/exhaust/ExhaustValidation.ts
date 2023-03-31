import { USER_EXHAUST_TIMEOUT } from "@providers/constants/ServerConstants";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { CharacterLastAction } from "../character/CharacterLastAction";

@provide(ExhaustValidation)
export class ExhaustValidation {
  constructor(private characterLastAction: CharacterLastAction) {}

  public async verifyLastActionExhaustTime(characterId: string, action: string): Promise<boolean> {
    const actionLastExecution = await this.characterLastAction.getActionLastExecution(characterId, action);
    if (actionLastExecution === undefined) {
      // first time action was executed
      await this.characterLastAction.setActionLastExecution(characterId, action);
      return false;
    }
    const now = dayjs(new Date());
    const actionDiff = now.diff(dayjs(actionLastExecution), "millisecond");
    if (actionDiff < USER_EXHAUST_TIMEOUT) {
      return true;
    } else {
      await this.characterLastAction.setActionLastExecution(characterId, action);
      return false;
    }
  }
}
