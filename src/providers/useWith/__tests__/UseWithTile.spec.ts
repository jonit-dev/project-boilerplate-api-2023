/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ToolsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

import { FromGridX, FromGridY, IUseWithTile, MapLayers } from "@rpg-engine/shared";
import { UseWithTile } from "../UseWithTile";

describe("UseWithTile.ts", () => {
  let testItem: IItem,
    testCharacter: ICharacter,
    testCharacterEquipment: IEquipment,
    useWithTile: UseWithTile,
    useWithTileData: IUseWithTile;

  beforeAll(async () => {
    useWithTile = container.get<UseWithTile>(UseWithTile);
    await unitTestHelper.initializeMapLoader();
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testCharacterEquipment = (await Equipment.findById(testCharacter.equipment)
      .populate("inventory")
      .exec()) as unknown as IEquipment;
    testItem = await unitTestHelper.createMockItemFromBlueprint(ToolsBlueprint.UseWithTileTest);

    // Locate character close to the tile
    testCharacter.x = FromGridX(0);
    testCharacter.y = FromGridY(1);
    await testCharacter.save();

    useWithTileData = {
      originItemId: testItem.id,
      targetTile: {
        x: FromGridX(0),
        y: FromGridY(0),
        map: "example",
        layer: "ground" as unknown as MapLayers,
      },
    };

    // equip character with item
    testCharacterEquipment.leftHand = testItem._id;
    await testCharacterEquipment.save();

    // @ts-ignore
    jest.spyOn(useWithTile.mapTiles, "getPropertyFromLayer" as any).mockImplementation(() => testItem.baseKey);
  });

  it("should pass all validations, run the useWithTileEffect and apply expected effect", async () => {
    // @ts-ignore
    const response = await useWithTile.validateData(testCharacter, useWithTileData);
    expect(response).toBeDefined();
    expect(response!.originItem.id).toEqual(testItem.id);

    await response?.useWithTileEffect!(
      response?.originItem,
      useWithTileData.targetTile,
      response?.targetName,
      testCharacter
    );

    expect(testCharacter.name).toEqual("Impacted by effect");
  });

  it("should fail validations | item without useWithTileEffect function defined", async () => {
    try {
      const itemBlueprint = itemsBlueprintIndex[testItem.baseKey];
      delete itemBlueprint.useWithTileEffect;
      // @ts-ignore
      await useWithTile.validateData(testCharacter, useWithTileData);
      throw new Error("This test should fail!");
    } catch (error: any) {
      expect(error.message).toEqual(
        `UseWithTile > originItem '${testItem.baseKey}' does not have a useWithTileEffect function defined`
      );
    }
  });

  it("should fail validations | character too far away from tile", async () => {
    testCharacter.x = FromGridX(5);
    testCharacter.y = FromGridY(5);
    await testCharacter.save();

    // @ts-ignore
    const sendErrorMsg = jest.spyOn(useWithTile.socketMessaging, "sendErrorMessageToCharacter" as any);

    // @ts-ignore
    const response = await useWithTile.validateData(testCharacter, useWithTileData);
    expect(response).toBeUndefined();
    expect(sendErrorMsg).toHaveBeenCalled();
  });

  it("validations should fail | character does not own item", async () => {
    try {
      testCharacterEquipment.leftHand = undefined;
      await testCharacterEquipment.save();
      // @ts-ignore
      await useWithTile.validateData(testCharacter, useWithTileData);
      throw new Error("This test should failed!");
    } catch (error: any) {
      expect(error.message).toEqual("UseWith > Character does not own the item that wants to use");
    }
  });
});
