import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill, ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { Item, IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemType, ItemSubType } from "@rpg-engine/shared/dist/types/item.types";
import { ISkillDetails } from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";
import { SkillCalculator } from "./SkillCalculator";

const ItemSkill = new Map<ItemSubType | string, string>([
  ["unarmed", "first"],
  [ItemSubType.Sword, "sword"],
  [ItemSubType.Dagger, "dagger"],
  [ItemSubType.Axe, "axe"],
  [ItemSubType.Bow, "distance"],
  [ItemSubType.Spear, "distance"],
  [ItemSubType.Shield, "shielding"],
  [ItemSubType.Mace, "club"],
]);

@provide(SkillIncrease)
export class SkillIncrease {
  constructor(private skillCalculator: SkillCalculator) {}

  public async increaseWeaponSP(character: ICharacter): Promise<void> {
    // Get character skills
    const skills = (await Skill.findById(character.skills)) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    const equipment = await Equipment.findById(character.equipment);
    if (!equipment) {
      throw new Error(`equipment not found for character ${character.id}`);
    }

    // Get right and left hand items
    // What if has weapons on both hands? for now, only one weapon per character is allowed
    const rightHandItem = equipment.rightHand ? await Item.findById(equipment.rightHand) : undefined;
    const leftHandItem = equipment.leftHand ? await Item.findById(equipment.leftHand) : undefined;

    // ItemSubType Shield is of type Weapon, so check that the weapon is not subType Shield (because cannot attack with Shield)
    let foundWeapon = false;
    if (rightHandItem?.type === ItemType.Weapon && rightHandItem?.subType !== ItemSubType.Shield) {
      foundWeapon = true;
      return this.increaseItemSP(skills, rightHandItem);
    }

    if (leftHandItem?.type === ItemType.Weapon && leftHandItem?.subType !== ItemSubType.Shield) {
      foundWeapon = true;
      return this.increaseItemSP(skills, leftHandItem);
    }

    // If user has no weapons (unarmed), then update 'first' skill
    if (!foundWeapon) {
      return this.increaseItemSP(skills, { subType: "unarmed" } as IItem);
    }
  }

  public async increaseShieldingSP(character: ICharacter): Promise<void> {
    const skills = (await Skill.findById(character.skills)) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }
    const equipment = await Equipment.findById(character.equipment);
    if (!equipment) {
      throw new Error(`equipment not found for character ${character.id}`);
    }

    const rightHandItem = equipment.rightHand ? await Item.findById(equipment.rightHand) : undefined;
    const leftHandItem = equipment.leftHand ? await Item.findById(equipment.leftHand) : undefined;

    if (rightHandItem?.subType === ItemSubType.Shield) {
      return this.increaseItemSP(skills, rightHandItem);
    }

    if (leftHandItem?.subType === ItemSubType.Shield) {
      return this.increaseItemSP(skills, leftHandItem);
    }
  }

  public async increaseItemSP(skills: ISkill, item: IItem): Promise<void> {
    const skillToUpdate = ItemSkill.get(item.subType);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${item.subType}`);
    }

    const updatedSkillDetails = skills[skillToUpdate] as ISkillDetails;
    updatedSkillDetails.skillPoints++;
    updatedSkillDetails.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(
      updatedSkillDetails.skillPoints,
      updatedSkillDetails.level + 1
    );

    if (updatedSkillDetails.skillPointsToNextLevel <= 0) {
      updatedSkillDetails.level++;
      updatedSkillDetails.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(
        updatedSkillDetails.skillPoints,
        updatedSkillDetails.level + 1
      );
    }

    skills[skillToUpdate] = updatedSkillDetails;
    await skills.save();
  }
}
