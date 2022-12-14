import { QuestsBlueprint } from "../../questsBlueprintTypes";
import { questKillDeers } from "./QuestKillDeers";
import { questKillRats } from "./QuestKillRats";
import { questOrcFortress } from "./QuestOrcFortress";

export const killQuests = {
  [QuestsBlueprint.OrcFortress]: questOrcFortress,
  [QuestsBlueprint.KillRats]: questKillRats,
  [QuestsBlueprint.KillDeers]: questKillDeers,
};
