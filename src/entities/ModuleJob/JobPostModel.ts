import { Currency, SeniorityLevel, WorkSchedule } from "@project-remote-job-board/shared/dist";
import { TypeHelper } from "@providers/types/TypeHelper";
import mongoosePaginate from "mongoose-paginate-v2";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const jobPostSchema = createSchema(
  {
    email: Type.string(),
    title: Type.string({
      required: true,
    }),
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
    externalSourceUrl: Type.string(),
    country: {
      name: Type.string(),
      code: Type.string(),
    },
    city: Type.string(),
    isFeatured: Type.boolean({
      default: false,
    }),
    company: Type.objectId({ ref: "Company" }),
    tags: Type.array().of(Type.string()),
    views: Type.number({ default: 0 }),
    votes: Type.array().of(Type.objectId()),
    salary: Type.number(),
    currency: Type.string({ default: Currency.USD }),
    salaryRange: Type.array().of(Type.number()),
    skills: Type.array().of(Type.string()),
    benefits: Type.array().of(Type.string()),
    workplaceValues: Type.array().of(Type.string()),
    sourceUrl: Type.string(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

jobPostSchema.plugin(mongoosePaginate);

export type IJobPost = ExtractDoc<typeof jobPostSchema>;

export const JobPost = typedModel("JobPost", jobPostSchema);
