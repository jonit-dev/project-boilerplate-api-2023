import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { MapLayers } from "@rpg-engine/shared";
import { IUseWithItemToTileOptions, UseWithItemToTile } from "../UseWithItemToTile";

jest.mock("lodash/random", () => jest.fn());

describe("UseWithItemToTile.ts", () => {
  let useWithItemToTile: UseWithItemToTile;
  let skillIncrease: SkillIncrease;
  let mockCharacter: ICharacter;
  const baseOptions: IUseWithItemToTileOptions = {
    rewards: [
      {
        chance: 20,
        key: CraftingResourcesBlueprint.IronOre,
        qty: [0, 3],
      },
      {
        chance: 10,
        key: CraftingResourcesBlueprint.GoldenOre,
        qty: 3,
      },
    ],
    targetTile: {
      layer: MapLayers.Ground,
      map: "test map",
      x: 32,
      y: 45,
    },
    errorAnimationEffectKey: "errorEffectKey",
    errorMessages: ["error1", "error2", "error3"],
    successAnimationEffectKey: "successEffectKey",
    targetTileAnimationEffectKey: "targetTileEffectKey",
    successMessages: ["success1", "success2", "success3"],
    requiredResource: {
      key: CraftingResourcesBlueprint.WaterBottle,
      decrementQty: 1,
      errorMessage: "you need to stay hydrated",
    },
  };

  beforeEach(async () => {
    useWithItemToTile = container.get<UseWithItemToTile>(UseWithItemToTile);
    mockCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
  });

  it("should make sure the character has the required items", async () => {});

  it("should decrement required resource and send the correct events", async () => {});

  it("should add item to character inventory send the correct events", async () => {});

  it("should add rewards sorted from rare to common", async () => {});
});
