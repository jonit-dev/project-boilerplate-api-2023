import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBandage: Partial<IItem> = {
  key: CraftingResourcesBlueprint.Bandage,
  type: ItemType.Consumable,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/bandage.png",
  name: "Bandage",
  description: "A piece of soft cloth material that can be used to stop bleeding.",
  weight: 0.04,
  maxStackSize: 100,
  basePrice: 12,
  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);
    const entityEffectUse = container.get(EntityEffectUse);

    itemUsableEffect.apply(character, EffectableAttribute.Health, 3);

    // cure bleeding effect
    await entityEffectUse.clearEntityEffect(EntityEffectBlueprint.Bleeding, character);
  },
};
