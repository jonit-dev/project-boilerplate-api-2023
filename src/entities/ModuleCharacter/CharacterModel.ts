import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { CharacterClass, FromGridX, FromGridY, ItemSubType, ItemType, MapLayers, TypeHelper } from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Equipment, IEquipment } from "./EquipmentModel";
import { Skill } from "./SkillsModel";

const characterSchema = createLeanSchema(
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
    textureKey: Type.string({
      required: true,
      default: "kid-1",
    }),

    x: Type.number({
      default: FromGridX(39),
      required: true,
    }),
    y: Type.number({
      default: FromGridY(48),
      required: true,
    }),
    initialX: Type.number({
      default: FromGridX(39),
      required: true,
    }),
    initialY: Type.number({
      default: FromGridY(48),
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
      default: "ilya",
    }),
    initialScene: Type.string({
      required: true,
      default: "ilya",
    }),
    channelId: Type.string(),
    otherEntitiesInView: Type.mixed(),
    baseSpeed: Type.number({
      default: 2,
      required: true,
    }),
    weight: Type.number({
      default: 8.5,
      required: true,
    }),
    maxWeight: Type.number({
      default: 15,
      required: true,
    }),
    baseMovementIntervalMs: Type.number({
      default: 40,
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
      ref: "Equipment",
    }),
    ...({} as {
      isAlive: boolean;
      type: string;
      inventory: Promise<IItem>;
      speed: number;
      movementIntervalMs: number;
      weapon: Promise<IItem>;
    }),
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

characterSchema.virtual("movementIntervalMs").get(function (this: ICharacter) {
  const ratio = this.weight / this.maxWeight;

  if (ratio <= 1) {
    return this.baseMovementIntervalMs;
  }

  if (ratio > 1 && ratio <= 2) {
    return this.baseMovementIntervalMs * 0.8;
  }

  if (ratio > 2 && ratio <= 4) {
    return this.baseMovementIntervalMs * 0.6;
  }

  if (ratio > 4) {
    return 0;
  }
});

characterSchema.virtual("speed").get(function (this: ICharacter) {
  const ratio = this.weight / this.maxWeight;

  if (ratio <= 1) {
    return this.baseSpeed;
  }

  if (ratio > 1 && ratio <= 2) {
    return this.baseSpeed * 0.8;
  }

  if (ratio > 2 && ratio <= 4) {
    return this.baseSpeed * 0.6;
  }

  if (ratio > 4) {
    return 0;
  }
});

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

characterSchema.virtual("weapon").get(async function (this: ICharacter) {
  const equipment = (await Equipment.findById(this.equipment)) as IEquipment;

  if (!equipment) {
    return { subType: "unarmed" } as IItem;
  }
  // Get right and left hand items
  // What if has weapons on both hands? for now, only one weapon per character is allowed
  const rightHandItem = equipment.rightHand ? await Item.findById(equipment.rightHand) : undefined;
  const leftHandItem = equipment.leftHand ? await Item.findById(equipment.leftHand) : undefined;

  // ItemSubType Shield is of type Weapon, so check that the weapon is not subType Shield (because cannot attack with Shield)
  if (rightHandItem?.type === ItemType.Weapon && rightHandItem?.subType !== ItemSubType.Shield) {
    return rightHandItem;
  }

  if (leftHandItem?.type === ItemType.Weapon && leftHandItem?.subType !== ItemSubType.Shield) {
    return leftHandItem;
  }

  // If user has no weapons return unarmed
  return { subType: "unarmed" } as IItem;
});

characterSchema.post("remove", async function (this: ICharacter) {
  const skill = await Skill.findOne({ _id: this.skills });

  if (skill) {
    await skill.remove();
  }
});

export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
