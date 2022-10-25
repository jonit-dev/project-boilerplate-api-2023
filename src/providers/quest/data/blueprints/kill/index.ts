import { QuestsBlueprint } from "../../questsBlueprintTypes";
import { questKillRats } from "./QuestKillRats";
import { questOrcFortress } from "./QuestOrcFortress";

export const killQuests = {
  [QuestsBlueprint.OrcFortress]: questOrcFortress,
  [QuestsBlueprint.KillRats]: questKillRats,
};
