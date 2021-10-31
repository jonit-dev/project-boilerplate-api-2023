import { SeniorityLevel, WorkSchedule } from "@project-remote-job-board/shared/dist";
import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateJobPostDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  email: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  title: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  industry: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  description: string;

  @IsOptional()
  @IsEnum(WorkSchedule, tsEnumDecorator("validation", "isEnum", WorkSchedule))
  workSchedule: WorkSchedule;

  @IsOptional()
  @IsEnum(SeniorityLevel, tsEnumDecorator("validation", "isEnum", SeniorityLevel))
  seniorityLevel: SeniorityLevel;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  countryCode: string;

  @IsOptional()
  @IsObject(tsDefaultDecorator("validation", "isType", { type: "object" }))
  country: object;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  city: string;

  @IsOptional()
  @IsBoolean(tsDefaultDecorator("validation", "isType", { type: "boolean" }))
  isFeatured: boolean;

  @IsOptional()
  @IsBoolean(tsDefaultDecorator("validation", "isType", { type: "boolean" }))
  workFromAnywhere: boolean;

  @IsOptional()
  @IsObject(tsDefaultDecorator("validation", "isType", { type: "object" }))
  company: string;

  @IsOptional()
  @IsString({
    each: true,
    ...tsDefaultDecorator("validation", "allArrayFields", { type: "string" }),
  })
  tags: string;

  @IsOptional()
  @IsNumber({}, tsDefaultDecorator("validation", "isType", { type: "number" }))
  salary: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      each: true,
      ...tsDefaultDecorator("validation", "allArrayFields", { type: "number" }),
    }
  )
  salaryRange: number;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  currency: string;

  @IsOptional()
  @IsString({
    each: true,
    ...tsDefaultDecorator("validation", "allArrayFields", { type: "string" }),
  })
  skills: string;

  @IsOptional()
  @IsString({
    each: true,
    ...tsDefaultDecorator("validation", "allArrayFields", { type: "string" }),
  })
  benefits: string;

  @IsOptional()
  @IsString({
    each: true,
    ...tsDefaultDecorator("validation", "allArrayFields", { type: "string" }),
  })
  workplaceValues: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  sourceUrl: string;
}
