import { SeniorityLevel, WorkSchedule } from "@project-remote-job-board/shared/dist";
import { TypeHelper } from "@providers/types/TypeHelper";
import mongoosePaginate from "mongoose-paginate-v2";
import randomstring from "randomstring";
import getSlug from "speakingurl";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const jobPostSchema = createSchema(
  {
    email: Type.string(),
    title: Type.string({
      required: true,
    }),
    slug: Type.string(),
    industry: Type.string(),
    description: Type.string({
      required: true,
    }),
    workSchedule: Type.string({
      default: WorkSchedule.FullTime,
      enum: TypeHelper.enumToStringArray(WorkSchedule),
    }),
    seniorityLevel: Type.string({
      enum: TypeHelper.enumToStringArray(SeniorityLevel),
    }),
    workFromAnywhere: Type.boolean(),
    country: {
      name: Type.string(),
      code: Type.string(),
    },
    city: Type.string(),
    isVisaRequired: Type.boolean(),
    isVisaSponsor: Type.boolean(),
    isFeatured: Type.boolean({
      default: false,
    }),
    company: Type.objectId({ ref: "Company" }),
    tags: Type.array().of(Type.string()),
    views: Type.number({ default: 0 }),
    votes: Type.array().of(Type.objectId()),
    salary: Type.number(),
    currency: Type.string({}),
    salaryRange: Type.array().of(Type.number()),
    skills: Type.array().of(Type.string()),
    benefits: Type.array().of(Type.string()),
    workplaceValues: Type.array().of(Type.string()),
    sourceUrl: Type.string(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

jobPostSchema.plugin(mongoosePaginate);

jobPostSchema.pre("save", function (next) {
  const jobPost = this as ExtractDoc<typeof jobPostSchema>;

  const randomString = randomstring.generate({
    length: 5,
    charset: "alphabetic",
  });

  const slug = getSlug(`${jobPost.title}-${randomString}`, { lang: "pt" });

  jobPost.slug = slug;

  next();
});

export type IJobPost = ExtractDoc<typeof jobPostSchema>;

export const JobPost = typedModel("JobPost", jobPostSchema);
