import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { CharacterPartyBenefits, calculatePartyBenefits } from "@providers/party/PartyManagement";
import { CharacterClass, TypeHelper } from "@rpg-engine/shared";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

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
    ...({} as {
      size: number;
      benefits: [{ benefit: CharacterPartyBenefits; value: number }];
    }),
  },
  {
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

characterPartySchema.index({ leader: 1, members: 1, benefits: 1 }, { background: true });

characterPartySchema.virtual("size").get(function (this: ICharacterParty) {
  return this.members ? this.members.length + 1 : 0;
});

characterPartySchema.virtual("benefits").get(function (this: ICharacterParty) {
  const size = this.size;
  const leaderClass = this.leader.class;
  const memberClasses = this.members.map((member) => member.class);

  memberClasses.push(leaderClass);
  const uniqueClasses = new Set(memberClasses);

  const benefits = calculatePartyBenefits(size, uniqueClasses.size);

  return benefits;
});

characterPartySchema.post("save", function (doc) {
  console.log("Este documento foi salvo:", doc);
});

export type ICharacterParty = ExtractDoc<typeof characterPartySchema>;

export const CharacterParty = typedModel("CharacterParty", characterPartySchema);
