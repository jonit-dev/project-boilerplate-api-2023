import { Currency } from "@project-remote-job-board/shared/dist";
import { TypeHelper } from "@providers/types/TypeHelper";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

import { WorkSchedule } from "./JobPostTypes";

const jobPostSchema = createSchema(
  {
    email: Type.string(),
    title: Type.string(),
    jobRole: Type.string(),
    industry: Type.string(),
    description: Type.string(),
    workSchedule: Type.string({
      default: WorkSchedule.FullTime,
      enum: TypeHelper.enumToStringArray(WorkSchedule),
    }),
    country: Type.string(),
    city: Type.string(),
    isFeatured: Type.boolean(),
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

export type IJobPost = ExtractDoc<typeof jobPostSchema>;

export const JobPost = typedModel("JobPost", jobPostSchema);
