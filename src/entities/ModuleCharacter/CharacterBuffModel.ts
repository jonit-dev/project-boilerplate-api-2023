import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { CharacterBuffDurationType, CharacterBuffType, TypeHelper } from "@rpg-engine/shared";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const characterBuffModel = createLeanSchema({
  owner: Type.objectId({ ref: "Character", required: true }),
  type: Type.string({
    required: true,
    enum: TypeHelper.enumToStringArray(CharacterBuffType),
    default: CharacterBuffType.CharacterAttribute,
  }),
  trait: Type.string({
    required: true,
  }),
  buffPercentage: Type.number({
    required: true,
    default: 0,
  }),
  absoluteChange: Type.number({
    required: true,
    default: 0,
  }),
  durationSeconds: Type.number(),
  durationType: Type.string({
    required: true,
    enum: TypeHelper.enumToStringArray(CharacterBuffDurationType),
    default: CharacterBuffDurationType.Permanent,
  }),
  options: Type.mixed(),
  itemId: Type.string(),
  itemKey: Type.string(),
});

characterBuffModel.index(
  {
    owner: 1,
  },
  { background: true }
);

characterBuffModel.plugin(SpeedGooseCacheAutoCleaner);

export type ICharacterBuff = ExtractDoc<typeof characterBuffModel>;

export const CharacterBuff = typedModel("CharacterBuff", characterBuffModel);
