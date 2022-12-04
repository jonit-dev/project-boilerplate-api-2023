import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { UseWithItemToItem } from "@providers/useWith/abstractions/UseWithItemToItem";
import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
export const itemBatsWing: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.BatsWing,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bat-wing.png",
  name: "Bat Wing",
  description: "A crafting resource used for witchcraft and sorcery",
  weight: 1,
  maxStackSize: 50,
  basePrice: 0.5,
  hasUseWith: true,
  useWithItemEffect: async (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> => {
    const useWithItemToItem = container.get<UseWithItemToItem>(UseWithItemToItem);

    await useWithItemToItem.execute(targetItem, originItem, character, "cutting-wood");
  },
};
