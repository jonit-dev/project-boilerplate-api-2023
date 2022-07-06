import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { armorsBlueprintsIndex } from "./blueprints/armors/index";
import { axeBlueprintIndex } from "./blueprints/axes/index";
import { bodiesBlueprintsIndex } from "./blueprints/bodies/index";
import { bootsBlueprintIndex } from "./blueprints/boots/index";
import { containersBlueprintIndex } from "./blueprints/containers/index";
import { daggersBlueprintsIndex } from "./blueprints/daggers/index";
import { effectsBlueprintsIndex } from "./blueprints/effects/index";
import { foodsBlueprintIndex } from "./blueprints/foods/index";
import { helmetsBlueprintsIndex } from "./blueprints/helmets/index";
import { spearsBlueprintsIndex } from "./blueprints/spears/index";
import { swordBlueprintIndex } from "./blueprints/swords/index";
import { potionsBlueprintsIndex } from "./blueprints/potions/index";
import { bowsBlueprintIndex } from "./blueprints/bows/index";
import { glovesBlueprintIndex } from "./blueprints/gloves/index";
import { macesBlueprintIndex } from "./blueprints/maces/index";
import { magicsBlueprintIndex } from "./blueprints/magics/index";
import { othersBlueprintIndex } from "./blueprints/others/index";
import { staffsBlueprintIndex } from "./blueprints/staffs/index";
import { shieldsBlueprintIndex } from "./blueprints/shields/index";

export const itemsBlueprintIndex: IBlueprint = {
  ...bodiesBlueprintsIndex,
  ...containersBlueprintIndex,
  ...effectsBlueprintsIndex,
  ...helmetsBlueprintsIndex,
  ...swordBlueprintIndex,
  ...daggersBlueprintsIndex,
  ...armorsBlueprintsIndex,
  ...axeBlueprintIndex,
  ...bootsBlueprintIndex,
  ...foodsBlueprintIndex,
  ...spearsBlueprintsIndex,
  ...potionsBlueprintsIndex,
  ...bowsBlueprintIndex,
  ...glovesBlueprintIndex,
  ...macesBlueprintIndex,
  ...magicsBlueprintIndex,
  ...othersBlueprintIndex,
  ...staffsBlueprintIndex,
  ...shieldsBlueprintIndex,
};
