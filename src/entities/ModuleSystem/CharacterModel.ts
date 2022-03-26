import { TypeHelper } from "@providers/types/TypeHelper";
import { CharacterClass, CharacterGender, FromGridX, FromGridY, MapLayers } from "@rpg-engine/shared";
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
      default: FromGridX(13),
      required: true,
    }),
    y: Type.number({
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
      default: MapLayers.Player,
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
    scene: Type.string({
      required: true,
      default: "MainScene",
    }),
    channelId: Type.string(),
    otherEntitiesInView: Type.mixed(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
