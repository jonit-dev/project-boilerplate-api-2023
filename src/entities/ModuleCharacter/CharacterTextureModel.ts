import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { CharacterFactions, LifeBringerRaces, ShadowWalkerRaces, TypeHelper } from "@rpg-engine/shared";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const characterTextureSchema = createLeanSchema({
  textureDisplayName: Type.string({
    required: true,
  }),
  textureKey: Type.string({
    required: true,
  }),
  faction: Type.string({
    required: true,
    enum: TypeHelper.enumToStringArray(CharacterFactions),
  }),
  race: Type.string({
    required: true,
    enum: Array.from(
      new Set(TypeHelper.enumToStringArray(LifeBringerRaces).concat(TypeHelper.enumToStringArray(ShadowWalkerRaces)))
    ),
  }),
});

export type ICharacterTexture = ExtractDoc<typeof characterTextureSchema>;

export const CharacterTexture = typedModel("CharacterTexture", characterTextureSchema);
