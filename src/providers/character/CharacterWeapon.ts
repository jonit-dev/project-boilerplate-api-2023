import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, SKILLS_MAP } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

export interface ICharacterWeaponResult {
  item: IItem;
  location: ItemSlotType;
}

@provide(CharacterWeapon)
export class CharacterWeapon {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  @TrackNewRelicTransaction()
  public async getWeapon(character: ICharacter): Promise<ICharacterWeaponResult | undefined> {
    const namespace = "character-weapon";
    const cachedResult = (await this.inMemoryHashTable.get(namespace, character._id)) as ICharacterWeaponResult;

    if (cachedResult) {
      return cachedResult;
    }

    const equipment = (await Equipment.findById(character.equipment)
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-equipment`,
      })) as IEquipment;

    if (!equipment) {
      return undefined;
    }

    const rightHandItem = equipment.rightHand
      ? ((await Item.findById(equipment.rightHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;
    const leftHandItem = equipment.leftHand
      ? ((await Item.findById(equipment.leftHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;

    // ItemSubType Shield is of type Weapon, so check that the weapon is not subType Shield (because cannot attack with Shield)
    if (rightHandItem?.type === ItemType.Weapon && rightHandItem?.subType !== ItemSubType.Shield) {
      const result = { item: rightHandItem, location: ItemSlotType.RightHand };
      await this.inMemoryHashTable.set(namespace, character._id, result);
      return result;
    }

    if (leftHandItem?.type === ItemType.Weapon && leftHandItem?.subType !== ItemSubType.Shield) {
      const result = { item: leftHandItem, location: ItemSlotType.LeftHand };
      await this.inMemoryHashTable.set(namespace, character._id, result);
      return result;
    }
  }

  @TrackNewRelicTransaction()
  public async hasShield(character: ICharacter): Promise<
    | {
        leftHandItem?: IItem;
        rightHandItem?: IItem;
      }
    | undefined
  > {
    const hasCached = await this.inMemoryHashTable.get("character-shield", character._id);

    if (hasCached) {
      return hasCached;
    }

    const equipment = (await Equipment.findById(character.equipment)
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-equipment`,
      })) as IEquipment;

    if (!equipment) {
      return;
    }

    const leftHandItem = equipment.leftHand
      ? ((await Item.findById(equipment.leftHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;

    const rightHandItem = equipment.rightHand
      ? ((await Item.findById(equipment.rightHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;

    if (leftHandItem?.subType === ItemSubType.Shield || rightHandItem?.subType === ItemSubType.Shield) {
      await this.inMemoryHashTable.set("character-shield", character._id, { leftHandItem, rightHandItem });

      return { leftHandItem, rightHandItem };
    }
  }

  @TrackNewRelicTransaction()
  public async getAttackType(character: ICharacter): Promise<EntityAttackType | undefined> {
    const weapon = await this.getWeapon(character);

    if (!weapon || !weapon.item) {
      return EntityAttackType.Melee;
    }

    const rangeType = weapon?.item.rangeType as unknown as EntityAttackType;

    return rangeType;
  }

  //! There's no need to track this transaction because it causes a bug and its already being tracked on getWeapon
  public async getSkillNameByWeapon(character: ICharacter): Promise<string | undefined> {
    const weapon = await this.getWeapon(character);

    if (!weapon) {
      return;
    }

    const weaponSubType = weapon?.item ? weapon?.item.subType || "None" : "None";
    const skillName = SKILLS_MAP.get(weaponSubType);

    if (!skillName) {
      console.error("Failed to get skill name for ", weapon, "for character", character);
      return;
    }

    return skillName;
  }
}
