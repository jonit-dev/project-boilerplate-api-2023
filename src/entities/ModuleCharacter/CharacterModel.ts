import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import {
  CharacterClass,
  CharacterFactions,
  FromGridX,
  FromGridY,
  ItemSubType,
  ItemType,
  LifeBringerRaces,
  MapLayers,
  ShadowWalkerRaces,
  TypeHelper,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Equipment, IEquipment } from "./EquipmentModel";
import { Skill } from "./SkillsModel";
import { profanity } from "@2toad/profanity";

const characterSchema = createLeanSchema(
  {
    name: Type.string({
      required: true,
      minlength: 3,
      maxlength: 44,
      validate: (value) => {
        if (profanity.exists(value)) {
          throw new Error("Name contains blacklisted words");
        }
      },
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
    faction: Type.string({
      required: true,
      enum: TypeHelper.enumToStringArray(CharacterFactions),
      default: CharacterFactions.LifeBringer,
    }),
    race: Type.string({
      required: true,
      enum: Array.from(
        new Set(TypeHelper.enumToStringArray(LifeBringerRaces).concat(TypeHelper.enumToStringArray(ShadowWalkerRaces)))
      ),
      default: LifeBringerRaces.Human,
    }),
    textureKey: Type.string({
      required: true,
      default: "kid-1",
    }),

    x: Type.number({
      default: FromGridX(33),
      required: true,
    }),
    y: Type.number({
      default: FromGridY(38),
      required: true,
    }),
    initialX: Type.number({
      default: FromGridX(33),
      required: true,
    }),
    initialY: Type.number({
      default: FromGridY(38),
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
      default: "ilya-village-interiors",
    }),
    initialScene: Type.string({
      required: true,
      default: "ilya-village-interiors",
    }),
    channelId: Type.string(),
    otherEntitiesInView: Type.mixed(),
    baseSpeed: Type.number({
      default: MovementSpeed.Slow,
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
    learnedSpells: Type.array().of(
      Type.string({
        enum: TypeHelper.enumToStringArray(SpellsBlueprint),
      })
    ),
    appliedEntityEffects: Type.array().of(Type.mixed({})),
    ...({} as {
      isAlive: boolean;
      type: string;
      inventory: Promise<IItem>;
      speed: number;
      movementIntervalMs: number;
      weapon: Promise<IItem | undefined>;
      attackType: Promise<EntityAttackType>;
    }),
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

characterSchema.virtual("movementIntervalMs").get(function (this: ICharacter) {
  return 1000 / this.speed / 12;
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

characterSchema.virtual("attackType").get(async function (this: ICharacter): Promise<EntityAttackType> {
  const weapon = await this.weapon;

  if (!weapon) {
    return EntityAttackType.Melee;
  }

  const rangeType = weapon?.rangeType as unknown as EntityAttackType;

  return rangeType;
});

characterSchema.virtual("weapon").get(async function (this: ICharacter): Promise<IItem | undefined> {
  const equipment = (await Equipment.findById(this.equipment)) as IEquipment;

  if (!equipment) {
    return undefined;
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
});

characterSchema.post("remove", async function (this: ICharacter) {
  try {
    const skill = await Skill.findOne({ _id: this.skills });
    if (skill) {
      await skill.remove();
    }

    const depot = await Depot.findOne({ owner: this._id });
    if (depot) {
      await depot.remove();
    }

    const equipment = await Equipment.findOne({ owner: this._id });
    if (equipment) {
      await equipment.remove();
    }

    const inventory = await ItemContainer.findOne({ owner: this._id });
    if (inventory) {
      await inventory.remove();
    }

    const items = await Item.find({ owner: this._id });
    if (items) {
      for (const item of items) {
        await item.remove();
      }
    }

    const user = await User.findOne({ characters: this._id });
    if (user) {
      await User.updateOne({
        $pull: {
          characters: this._id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
