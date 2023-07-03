import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { CharacterClass, TypeHelper } from "@rpg-engine/shared";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

enum CharacterPartyBenefits {
  Experience = "experience",
  DropRatio = "drop-ratio",
  Skill = "skill",
  Distribution = "distribution",
}

const characterPartySchema = createLeanSchema(
  {
    leader: {
      _id: Type.objectId({
        required: true,
      }),
      class: Type.string({
        enum: TypeHelper.enumToStringArray(CharacterClass),
        required: true,
      }),
    },
    members: Type.array({
      required: true,
    }).of({
      _id: Type.objectId({
        required: true,
      }),
      class: Type.string({
        enum: TypeHelper.enumToStringArray(CharacterClass),
        default: CharacterClass.None,
        required: true,
      }),
    }),
    maxSize: Type.number({
      required: true,
      max: 5,
      min: 2,
    }),
    benefits: Type.array().of({
      benefit: Type.string({
        enum: TypeHelper.enumToStringArray(CharacterPartyBenefits),
        required: true,
      }),
      value: Type.number({
        required: true,
      }),
    }),
    ...({} as {
      size: number;
    }),
  },
  {
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

characterPartySchema.index({ leader: 1, members: 1 }, { background: true });

characterPartySchema.virtual("size").get(function (this: ICharacterParty) {
  return this.members ? this.members.length + 1 : 0;
});

export type ICharacterParty = ExtractDoc<typeof characterPartySchema>;

export const CharacterParty = typedModel("CharacterParty", characterPartySchema);
