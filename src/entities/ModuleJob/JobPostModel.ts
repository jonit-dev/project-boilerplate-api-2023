import { Currency, WorkSchedule } from "@project-remote-job-board/shared/dist";
import { TypeHelper } from "@providers/types/TypeHelper";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const jobPostSchema = createSchema(
  {
    email: Type.string(),
    title: Type.string({
      required: true,
    }),
    jobRole: Type.string({
      required: true,
    }),
    industry: Type.string({
      required: true,
    }),
    description: Type.string({
      required: true,
    }),
    workSchedule: Type.string({
      required: true,
      default: WorkSchedule.FullTime,
      enum: TypeHelper.enumToStringArray(WorkSchedule),
    }),
    countryCode: Type.string({
      required: true,
    }),
    city: Type.string({
      required: true,
    }),
    isFeatured: Type.boolean({
      required: true,
      default: false,
    }),
    company: Type.objectId({ ref: "Company" }),
    tags: Type.array().of(Type.string()),
    views: Type.number({ default: 0, required: true }),
    votes: Type.array().of(Type.objectId()),
    salary: Type.number(),
    currency: Type.string({ default: Currency.USD, required: true }),
    salaryRange: Type.array().of(Type.number()),
    skills: Type.array().of(Type.string()),
    benefits: Type.array().of(Type.string()),
    workplaceValues: Type.array().of(Type.string()),
    sourceUrl: Type.string(),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IJobPost = ExtractDoc<typeof jobPostSchema>;

export const JobPost = typedModel("JobPost", jobPostSchema);
