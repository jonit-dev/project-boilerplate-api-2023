import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { friendlyNPCs } from "./blueprints/friendly/index";
import { bossesBlueprints } from "./blueprints/hostile/bosses/index";
import { hostileNPCs } from "./blueprints/hostile/index";
import { neutralNPCs } from "./blueprints/neutral/index";

export const npcsBlueprintIndex: IBlueprint = {
  ...friendlyNPCs,
  ...neutralNPCs,
  ...hostileNPCs,
  ...bossesBlueprints,
};
