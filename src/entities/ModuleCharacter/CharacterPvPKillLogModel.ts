import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const characterPvPKillLogModel = createLeanSchema({
  killer: Type.objectId({ ref: "Character", required: true }),
  target: Type.objectId({ ref: "Character", required: true }),
  x: Type.number({
    required: true,
  }),
  y: Type.number({
    required: true,
  }),
  isJustify: Type.boolean({
    required: true,
  }),
  createdAt: Type.date({
    required: true,
  }),
});

characterPvPKillLogModel.index(
  {
    killer: 1,
    target: 1,
  },
  { background: true }
);

characterPvPKillLogModel.plugin(SpeedGooseCacheAutoCleaner);

export type ICharacterPvPKillLog = ExtractDoc<typeof characterPvPKillLogModel>;

export const CharacterPvPKillLog = typedModel("CharacterPvPKillLog", characterPvPKillLogModel);
