import { profanity } from "@2toad/profanity";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
import {
  CharacterClass,
  CharacterFactions,
  FromGridX,
  FromGridY,
  LifeBringerRaces,
  MapLayers,
  Modes,
  ShadowWalkerRaces,
  SpellsBlueprint,
  TypeHelper,
  getSpeedMultiplierBasedOnWeightRatio,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Equipment } from "./EquipmentModel";
import { Skill } from "./SkillsModel";

profanity.addWords([
  "Admin",
  "ADMIN",
  "Adm",
  "ADM",
  "Admn",
  "ADMN",
  "Game Master",
  "GameMaster",
  "GMaster",
  "Gmaster",
  "GameM",
  "GM",
  "Adm",
  "ADM",
  "A.D.M",
  "a.d.m",
  "Superuser",
  "super-user",
  "super_user",
  "superUser",
  "SuperUser",
  "Root",
  "ROOT",
  "r00t",
  "rOoT",
  "Manager",
  "MANAGER",
  "Mngr",
  "mngr",
  "Managr",
  "managr",
  "Administrator",
  "administrador",
  "administrateur",
  "amministratore",
  "Adminstrator",
  "adminstrator",
  "GameMaster",
  "GMaster",
  "Gmaster",
  "GameM",
  "GM",
  "Gamemaster",
  "GameMaster",
]);

const characterSchema = createLeanSchema(
  {
    name: Type.string({
      required: true,
      minlength: 3,
      maxlength: 20,
      validate: (value) => {
        if (profanity.exists(value)) {
          throw new Error("Name contains blacklisted words");
        }
      },
    }),
    owner: Type.objectId({
      required: true,
      ref: "User",
      index: true,
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
      enum: [...TypeHelper.enumToStringArray(LifeBringerRaces), ...TypeHelper.enumToStringArray(ShadowWalkerRaces)],
      default: LifeBringerRaces.Human,
    }),
    mode: Type.string({
      required: true,
      enum: TypeHelper.enumToStringArray(Modes),
      default: Modes.SoftMode,
    }),
    isSoftDeleted: Type.boolean({
      required: true,
      default: false,
    }),
    textureKey: Type.string({
      required: true,
      default: "kid-1",
    }),

    x: Type.number({
      default: FromGridX(110),
      required: true,
    }),
    y: Type.number({
      default: FromGridY(106),
      required: true,
    }),
    initialX: Type.number({
      default: FromGridX(110),
      required: true,
    }),
    initialY: Type.number({
      default: FromGridY(106),
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
      default: MovementSpeed.Standard,
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
    isAdmin: Type.boolean({
      default: false,
      required: true,
    }),
    penalty: Type.number({
      default: 0,
      required: true,
    }),
    alpha: Type.number(),
    banRemovalDate: Type.date(),
    hasPermanentBan: Type.boolean(),
    captchaVerifyCode: Type.string({
      select: false,
    }),
    captchaVerifyDate: Type.date(),
    captchaTriesLeft: Type.number(),
    captchaNoVerifyUntil: Type.date(),
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
      default: 1700,
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
    appliedBuffsEffects: Type.array().of(
      Type.mixed({
        _id: Type.objectId({ auto: true }),
        key: Type.string({ required: true }),
        value: Type.string({ required: true }),
      })
    ),
    ...({} as {
      isAlive: boolean;
      type: string;
      inventory: Promise<IItem>;
      speed: number;
      movementIntervalMs: number;
      attackType: Promise<EntityAttackType>;
    }),
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

characterSchema.index(
  {
    x: 1,
    y: 1,
    scene: 1,
    isOnline: 1,
    isBanned: 1,
  },
  { background: true }
);

characterSchema.virtual("movementIntervalMs").get(function (this: ICharacter) {
  return 1000 / this.speed / 48;
});

characterSchema.virtual("speed").get(function (this: ICharacter) {
  const ratio = this.weight / this.maxWeight;

  return this.baseSpeed * getSpeedMultiplierBasedOnWeightRatio(ratio);
});

characterSchema.virtual("isAlive").get(function (this: ICharacter) {
  return this.health > 0;
});

characterSchema.virtual("type").get(function (this: ICharacter) {
  return "Character";
});

characterSchema.post("remove", async function (this: ICharacter) {
  try {
    await Promise.all([
      Skill.deleteOne({ _id: this.skills }),
      Depot.deleteOne({ owner: this._id }),
      Equipment.deleteOne({ owner: this._id }),
      ItemContainer.deleteOne({ owner: this._id }),
      Item.deleteMany({ owner: this._id }),
      User.updateOne(
        { characters: this._id },
        {
          $pull: {
            characters: this._id,
          },
        }
      ),
    ]);
  } catch (error) {
    console.log(error);
  }
});
export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
