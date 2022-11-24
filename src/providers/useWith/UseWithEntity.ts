import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ITEM_USE_WITH_ENTITY_GRID_CELL_RANGE } from "@providers/constants/ItemConstants";
import { ItemValidation } from "@providers/item/validation/ItemValidation";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  CharacterSocketEvents,
  ICharacterAttributeChanged,
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  ItemSocketEvents,
  IUseWithEntity,
  UseWithSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { IMagicItemUseWithEntity } from "./useWithTypes";

@provide(UseWithEntity)
export class UseWithEntity {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private itemValidation: ItemValidation,
    private socketAuth: SocketAuth,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight,
    private animationEffect: AnimationEffect,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public onUseWithEntity(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      UseWithSocketEvents.UseWithEntity,
      async (data: IUseWithEntity, character) => {
        if (data) {
          await this.execute(data, character);
        }
      }
    );
  }

  public async execute(payload: IUseWithEntity, character: ICharacter): Promise<void> {
    const target = payload.entityId ? await this.getEntity(payload.entityId, payload.entityType) : null;
    const item = payload.itemId ? ((await Item.findById(payload.itemId)) as unknown as IItem) : null;

    const isValid = await this.validateRequest(character, target, item);
    if (!isValid) {
      return;
    }

    await this.executeEffect(character, target!, item!);
  }

  private async validateRequest(
    caster: ICharacter,
    target: ICharacter | INPC | null,
    item: IItem | null
  ): Promise<boolean> {
    if (!target) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target was not found.");
      return false;
    }

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, item you are trying to use was not found.");
      return false;
    }

    const blueprint = itemsBlueprintIndex[item.key];
    if (!blueprint || !blueprint.power || !blueprint.usableEffect) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, `Sorry, '${item.name}' cannot be used with target.`);
      return false;
    }

    if (!this.characterValidation.hasBasicValidation(caster)) {
      return false;
    }

    if (!target.isAlive) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target is dead.");
      return false;
    }

    if (target.type === EntityType.Character) {
      const customMsg = new Map([
        ["not-online", "Sorry, your target is offline."],
        ["banned", "Sorry, your target is banned."],
      ]);

      if (!this.characterValidation.hasBasicValidation(target as ICharacter, customMsg)) {
        return false;
      }
    }

    if (caster.scene !== target.scene) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target is not on the same scene.");
      return false;
    }

    const isUnderRange = this.movementHelper.isUnderRange(
      caster.x,
      caster.y,
      target.x,
      target.y,
      ITEM_USE_WITH_ENTITY_GRID_CELL_RANGE
    );
    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your taget is out of reach.");
      return false;
    }

    if (!(await this.itemValidation.isItemInCharacterInventory(caster, item._id))) {
      return false;
    }

    const updatedCharacter = (await Character.findOne({ _id: caster._id }).populate("skills")) as unknown as ICharacter;
    const skills = updatedCharacter.skills as unknown as ISkill;
    const casterMagicLevel = skills?.magic?.level ?? 0;

    if (casterMagicLevel < blueprint.minMagicLevelRequired) {
      this.socketMessaging.sendErrorMessageToCharacter(
        caster,
        `Sorry, '${blueprint.name}' can not only be used with target at magic level '${blueprint.minMagicLevelRequired}' or greater.`
      );
      return false;
    }

    return true;
  }

  private async executeEffect(caster: ICharacter, target: ICharacter | INPC, item: IItem): Promise<void> {
    const blueprint = itemsBlueprintIndex[item.key];

    await blueprint.usableEffect(caster, target);
    await target.save();

    await this.characterItemInventory.decrementItemFromInventory(item.key, caster, 1);
    await this.characterWeight.updateCharacterWeight(caster);

    await this.sendRefreshItemsEvent(caster);
    await this.sendTargetUpdateEvents(caster, target);

    await this.sendAnimationEvents(caster, target, blueprint as IMagicItemUseWithEntity);
  }

  private async sendRefreshItemsEvent(character: ICharacter): Promise<void> {
    const container = (await this.characterItemContainer.getItemContainer(character)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: container,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  private async sendTargetUpdateEvents(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    const payload: ICharacterAttributeChanged = {
      targetId: target._id,
      health: target.health,
      mana: target.mana,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      CharacterSocketEvents.AttributeChanged,
      payload
    );
  }

  private async sendAnimationEvents(
    caster: ICharacter,
    target: ICharacter | INPC,
    item: IMagicItemUseWithEntity
  ): Promise<void> {
    await this.animationEffect.sendAnimationEventToCharacter(caster, item.animationKey, target._id);
  }

  private async getEntity(entityId: string, entityType: EntityType): Promise<ICharacter | INPC> {
    if (entityType === EntityType.Character) {
      return (await Character.findById(entityId)) as unknown as ICharacter;
    } else {
      return (await NPC.findById(entityId)) as unknown as INPC;
    }
  }
}
