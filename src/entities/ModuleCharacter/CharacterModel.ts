import { IItem } from "@entities/ModuleInventory/ItemModel";
import { CharacterClass, CharacterGender, FromGridX, FromGridY, MapLayers, TypeHelper } from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Equipment } from "./EquipmentModel";
import { Skill } from "./SkillsModel";

const characterSchema = createSchema(
  {
    name: Type.string({
      required: true,
    }),
    owner: Type.objectId({
      required: true,
      ref: "User",
    }),
    health: Type.number({
      default: 100,
      required: true,
    }),
    maxHealth: Type.number({
      default: 100,
      required: true,
    }),
    mana: Type.number({
      default: 100,
      required: true,
    }),
    maxMana: Type.number({
      default: 100,
      required: true,
    }),
    x: Type.number({
      default: FromGridX(13),
      required: true,
    }),
    y: Type.number({
      default: FromGridY(12),
      required: true,
    }),
    initialX: Type.number({
      default: FromGridX(13),
      required: true,
    }),
    initialY: Type.number({
      default: FromGridY(12),
      required: true,
    }),
    direction: Type.string({
      default: "down",
      required: true,
    }),
    class: Type.string({
      required: true,
      default: CharacterClass.None,
      enum: TypeHelper.enumToStringArray(CharacterClass),
    }),
    gender: Type.string({
      required: true,
      default: CharacterGender.Male,
      enum: TypeHelper.enumToStringArray(CharacterGender),
    }),
    totalWeightCapacity: Type.number({
      required: true,
      default: 100,
    }),
    isOnline: Type.boolean({
      default: false,
      required: true,
    }),
    layer: Type.number({
      default: MapLayers.Character,
      required: true,
    }),
    scene: Type.string({
      required: true,
      default: "MainScene",
    }),
    initialScene: Type.string({
      required: true,
      default: "MainScene",
    }),
    channelId: Type.string(),
    otherEntitiesInView: Type.mixed(),
    speed: Type.number({
      default: 2.5,
      required: true,
    }),
    movementIntervalMs: Type.number({
      default: 150,
      required: true,
    }),
    isBanned: Type.boolean({
      default: false,
      required: true,
    }),
    penalty: Type.number({
      default: 0,
      required: true,
    }),
    banRemovalDate: Type.date(),
    hasPermanentBan: Type.boolean(),
    lastMovement: Type.date(),
    skills: Type.objectId({
      ref: "Skill",
      required: true,
    }),
    target: {
      id: Type.objectId(),
      type: Type.string({
        enum: TypeHelper.enumToStringArray(EntityType),
      }),
    },
    attackType: Type.string({
      required: true,
      enum: TypeHelper.enumToStringArray(EntityAttackType),
      default: EntityAttackType.Melee,
    }),
    attackIntervalSpeed: Type.number({
      required: true,
      default: 1000,
    }),
    view: Type.mixed({
      default: {
        items: {},
        characters: {},
        npcs: {},
      },
    }),
    equipment: Type.objectId({
      required: true,
      ref: "Equipment",
    }),
    ...({} as {
      isAlive: boolean;
      type: string;
      inventory: Promise<IItem>;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

characterSchema.virtual("isAlive").get(function (this: ICharacter) {
  return this.health > 0;
});

characterSchema.virtual("type").get(function (this: ICharacter) {
  return "Character";
});

characterSchema.virtual("inventory").get(async function (this: ICharacter) {
  const equipment = await Equipment.findById(this.equipment).populate("inventory").exec();

  if (equipment) {
    const inventory = equipment.inventory! as unknown as IItem;

    if (inventory) {
      return inventory;
    }
  }

  return null;
});

characterSchema.post("remove", async function (this: ICharacter) {
  const skill = await Skill.findOne({ _id: this.skills });

  if (skill) {
    await skill.remove();
  }
});

export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
