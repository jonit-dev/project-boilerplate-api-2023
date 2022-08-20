import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { killQuests } from "./blueprints/kill/index";
import { interactionQuests } from "./blueprints/interaction/index";

export const questsBlueprintIndex: IBlueprint = {
  ...killQuests,
  ...interactionQuests,
};
