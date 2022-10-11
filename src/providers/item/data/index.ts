import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { accessoriesBlueprintsIndex } from "./blueprints/accessories/index";
import { armorsBlueprintsIndex } from "./blueprints/armors/index";
import { axesBlueprintIndex } from "./blueprints/axes/index";
import { bodiesBlueprintsIndex } from "./blueprints/bodies/index";
import { bootsBlueprintIndex } from "./blueprints/boots/index";
import { containersBlueprintIndex } from "./blueprints/containers/index";
import { daggersBlueprintsIndex } from "./blueprints/daggers/index";
import { effectsBlueprintsIndex } from "./blueprints/effects/index";
import { foodsBlueprintIndex } from "./blueprints/foods/index";
import { glovesBlueprintIndex } from "./blueprints/gloves/index";
import { helmetsBlueprintsIndex } from "./blueprints/helmets/index";
import { legsBlueprintIndex } from "./blueprints/legs/index";
import { macesBlueprintIndex } from "./blueprints/maces/index";
import { magicsBlueprintIndex } from "./blueprints/magics/index";
import { othersBlueprintIndex } from "./blueprints/others/index";
import { potionsBlueprintsIndex } from "./blueprints/potions/index";
import { rangedWeaponsBlueprintIndex } from "./blueprints/ranged-weapons/index";
import { shieldsBlueprintIndex } from "./blueprints/shields/index";
import { spearsBlueprintsIndex } from "./blueprints/spears/index";
import { staffsBlueprintIndex } from "./blueprints/staffs/index";
import { swordBlueprintIndex } from "./blueprints/swords/index";

export const itemsBlueprintIndex: IBlueprint = {
  ...bodiesBlueprintsIndex,
  ...containersBlueprintIndex,
  ...effectsBlueprintsIndex,
  ...helmetsBlueprintsIndex,
  ...swordBlueprintIndex,
  ...daggersBlueprintsIndex,
  ...armorsBlueprintsIndex,
  ...axesBlueprintIndex,
  ...bootsBlueprintIndex,
  ...foodsBlueprintIndex,
  ...spearsBlueprintsIndex,
  ...potionsBlueprintsIndex,
  ...rangedWeaponsBlueprintIndex,
  ...glovesBlueprintIndex,
  ...macesBlueprintIndex,
  ...magicsBlueprintIndex,
  ...othersBlueprintIndex,
  ...staffsBlueprintIndex,
  ...shieldsBlueprintIndex,
  ...legsBlueprintIndex,
  ...accessoriesBlueprintsIndex,
};
