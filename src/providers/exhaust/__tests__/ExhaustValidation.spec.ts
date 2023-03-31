import { container } from "@providers/inversify/container";
import dayjs from "dayjs";
import { CharacterLastAction } from "../../character/CharacterLastAction";

describe("ExhaustValidation", () => {
  let characterLastAction: CharacterLastAction;

  beforeEach(() => {
    characterLastAction = container.get(CharacterLastAction);
  });

  describe("getActionLastExecution", () => {
    function check_time(last_execution, ms): Promise<number> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const now = dayjs(new Date());
          resolve(now.diff(dayjs(last_execution), "millisecond"));
        }, ms);
      });
    }

    it("should return a last execution time of more than 1500 ms ago", async () => {
      const characterId = "2";
      const action = "UseWithTile";
      await characterLastAction.setActionLastExecution(characterId, action);
      const last_execution = await characterLastAction.getActionLastExecution(characterId, action);
      const actionDiff = await check_time(last_execution, 1500);
      jest.advanceTimersByTime(1500);
      expect(actionDiff).toBeGreaterThanOrEqual(1500);
    });

    it("should return a last execution time of less than 1500 ms ago", async () => {
      const characterId = "2";
      const action = "UseWithTile";
      await characterLastAction.setActionLastExecution(characterId, action);
      const last_execution = await characterLastAction.getActionLastExecution(characterId, action);
      const actionDiff = await check_time(last_execution, 500);
      jest.advanceTimersByTime(500);
      expect(actionDiff).toBeLessThanOrEqual(1500);
    });
  });
});
