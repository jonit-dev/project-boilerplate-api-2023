import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ITEM_USE_WITH_ENTITY_GRID_CELL_RANGE } from "@providers/constants/ItemConstants";
import { ItemValidation } from "@providers/item/validation/ItemValidation";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUseWithEntity } from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { useWithEntityBlueprintsIndex } from "./blueprints/UseWithEntityBlueprints";

@provide(UseWithEntity)
export class UseWithEntity {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private itemValidation: ItemValidation
  ) {}

  public async execute(payload: IUseWithEntity, character: ICharacter): Promise<void> {
    const target = await this.getEntity(payload.entityId, payload.entityType);
    const item = (await Item.findById(payload.itemId)) as unknown as IItem;

    const isValid = await this.validateRequest(character, target, item);
    if (!isValid) {
      return;
    }

    await this.executeEffect(character, target, item);
  }

  private async validateRequest(caster: ICharacter, target: ICharacter | INPC, item: IItem): Promise<boolean> {
    if (!target) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target was not found.");
      return false;
    }

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, item you are trying to use was not found.");
      return false;
    }

    if (!useWithEntityBlueprintsIndex[item.key]) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, `Sorry, '${item.name}' cannot be used with target.`);
      return false;
    }

    if (!this.characterValidation.hasBasicValidation(caster)) {
      return false;
    }

    if (!target.isAlive) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your taget is dead.");
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

    return true;
  }

  private async executeEffect(caster: ICharacter, target: ICharacter | INPC, item: IItem): Promise<void> {
    await Promise.resolve();
  }

  private async getEntity(entityId: string, entityType: EntityType): Promise<ICharacter | INPC> {
    if (entityType === EntityType.Character) {
      return (await Character.findById(entityId)) as unknown as ICharacter;
    } else {
      return (await NPC.findById(entityId)) as unknown as INPC;
    }
  }
}
