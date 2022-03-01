import { TypeHelper } from "@providers/types/TypeHelper";
import { CharacterClass, CharacterGender } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

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
    mana: Type.number({
      default: 100,
      required: true,
    }),
    x: Type.number({
      default: 160,
      required: true,
    }),
    y: Type.number({
      default: 192,
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
    cameraCoordinates: {
      x: Type.number({
        default: 0,
        required: true,
      }),
      y: Type.number({
        default: 0,
        required: true,
      }),
      width: Type.number({
        default: 0,
        required: true,
      }),
      height: Type.number({
        default: 0,
        required: true,
      }),
    },
    otherPlayersInView: Type.array().of({
      id: Type.string(),
      name: Type.string(),
      x: Type.number(),
      y: Type.number(),
      direction: Type.string(),
    }),
    scene: Type.string({
      required: true,
      default: "MainScene",
    }),
    channelId: Type.string(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
