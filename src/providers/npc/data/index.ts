import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { friendlyNPCsIndex } from "./blueprints/friendly/index";
import { bossesNPCsIndex } from "./blueprints/hostile/bosses/index";
import { hostileNPCsIndex } from "./blueprints/hostile/index";
import { neutralNPCsIndex } from "./blueprints/neutral/index";

export const npcsBlueprintIndex: IBlueprint = {
  ...friendlyNPCsIndex,
  ...neutralNPCsIndex,
  ...hostileNPCsIndex,
  ...bossesNPCsIndex,
};
