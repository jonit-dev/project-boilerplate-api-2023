import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { ItemCraftable } from "@providers/item/ItemCraftable";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IUseWithItemToEntityOptions,
  IUseWithItemToEntityReward,
  UseWithItemToEntity,
} from "@providers/useWith/abstractions/UseWithItemToEntity";
import {
  CraftingSkill,
  IToolItemBlueprint,
  ItemRarities,
  ItemSlotType,
  ItemSubType,
  ItemType,
  NPCSubtype,
  RangeTypes,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { CraftingResourcesBlueprint, FoodsBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemButchersKnife: IToolItemBlueprint = {
  key: ToolsBlueprint.ButchersKnife,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/butchers-knife.png",
  name: "Butcher's Knife",
  description: "A bladed melee knife that can be used as a tool or weapon.",
  attack: 5,
  defense: 2,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 45,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Short,
  canSell: false,
  usableEffect: async (
    character: ICharacter,
    targetItem: IItem,
    itemCraftable: ItemCraftable,
    skillIncrease: SkillIncrease,
    originItem: IItem
  ) => {
    const useWithItemToEntity = container.get<UseWithItemToEntity>(UseWithItemToEntity);
    const socketMessaging = container.get<SocketMessaging>(SocketMessaging);
    const rarityOfTool = originItem.rarity ?? ItemRarities.Common;

    const targetEntity =
      (await NPC.findOne({ _id: targetItem.bodyFromId })) || (await Character.findOne({ _id: targetItem.bodyFromId }));

    if (!targetEntity) {
      socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you can't butcher this.");
      return;
    }

    if (targetEntity.type === EntityType.Character) {
      return;
    }

    if (targetItem.hasButchered) {
      socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this body have already been butchered.");
      return;
    }

    const baseUseWithTileToEntityOptions: IUseWithItemToEntityOptions = {
      targetEntity,
      errorMessages: [
        "Hmm... Nothing here.",
        "You effort is in vain.",
        "Hmm... You didn't find anything.",
        "Maybe you should try somewhere else.",
        "Butchering is a hard work! Nothing here!",
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
              chance: await itemCraftable.getCraftChance(character, CraftingSkill.Cooking, 20, rarityOfTool),
            },
          ],
        };
        break;
      case EntityType.NPC:
        // handle Container Item ie. StaticEntity ie. npc dead body
        const staticEntity = targetEntity as unknown as IItem;
        const subType = staticEntity.subType;
        const rewards: IUseWithItemToEntityReward[] = [];

        if (subType) {
          switch (subType) {
            case NPCSubtype.Animal:
              rewards.push({
                chance: await itemCraftable.getCraftChance(character, CraftingSkill.Cooking, 30, rarityOfTool),
                key: FoodsBlueprint.RedMeat,
                qty: [1, 3],
              });
              break;
            case NPCSubtype.Bird:
              rewards.push(
                {
                  chance: await itemCraftable.getCraftChance(character, CraftingSkill.Cooking, 30, rarityOfTool),
                  key: CraftingResourcesBlueprint.Feather,
                  qty: [1, 3],
                },
                {
                  chance: await itemCraftable.getCraftChance(character, CraftingSkill.Cooking, 30, rarityOfTool),
                  key: FoodsBlueprint.ChickensMeat,
                  qty: [1, 3],
                }
              );

              break;

            // more cases for other NPCs subtypes
            default:
              break;
          }
        }
        useWithItemToEntityOptions = {
          ...baseUseWithTileToEntityOptions,
          rewards: [...baseUseWithTileToEntityOptions.rewards, ...rewards],
        };
        break;
    }

    if (useWithItemToEntityOptions.rewards.length < 1) {
      socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you can't butcher this.");
      return;
    }

    await useWithItemToEntity.execute(character, useWithItemToEntityOptions, skillIncrease);

    // set hasButchered to true
    targetItem.hasButchered = true;
    await targetItem.save();
  },
  usableEffectDescription: "Use it to butcher a dead body",
};
