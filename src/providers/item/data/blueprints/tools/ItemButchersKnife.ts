import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { IUseWithItemToEntityOptions, UseWithItemToEntity } from "@providers/useWith/abstractions/UseWithItemToEntity";
import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { FoodsBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemButchersKnife: Partial<IItemUseWith> = {
  key: ToolsBlueprint.ButchersKnife,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/butchers-knife.png",
  name: "Butcher's Knife",
  description: "A bladed melee knife that can be used as a tool or weapon.",
  attack: 5,
  defense: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 45,
  hasUseWith: true,
  useWithMaxDistanceGrid: 2,
  usableEffect: async (character: ICharacter, targetEntity: ICharacter | INPC) => {
    const useWithItemToEntity = container.get<UseWithItemToEntity>(UseWithItemToEntity);

    const baseUseWithTileToEntityOptions: IUseWithItemToEntityOptions = {
      targetEntity,
      targetEntityAnimationEffectKey: "using-effect",
      errorMessages: [
        "Hmm... Nothing here.",
        "You effort is in vain.",
        "You can't find anything.",
        "Maybe you should try somewhere else.",
        "Mining is hard work! Nothing here!",
      ],
      successMessages: [
        "You found some meat!",
        "Wow! You got some meat!",
        "You found some meat! You can cook it for lunch.",
      ],
      rewards: [],
    };

    let useWithItemToEntityOptions: IUseWithItemToEntityOptions = baseUseWithTileToEntityOptions;

    switch (targetEntity.type) {
      case EntityType.Character:
        useWithItemToEntityOptions = {
          ...baseUseWithTileToEntityOptions,
          rewards: [
            ...baseUseWithTileToEntityOptions.rewards,
            {
              key: FoodsBlueprint.RedMeat,
              qty: [1, 3],
              chance: 20,
            },
            {
              key: FoodsBlueprint.RottenMeat,
              chance: 40,
              qty: [1, 6],
            },
          ],
        };
        break;
      case EntityType.NPC:
        useWithItemToEntityOptions = {
          ...baseUseWithTileToEntityOptions,
          rewards: [...baseUseWithTileToEntityOptions.rewards],
        };
        break;
    }

    await useWithItemToEntity.execute(character, useWithItemToEntityOptions);
  },
};
