import { WorkSchedule } from "@project-remote-job-board/shared/dist";
import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateJobPostDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  email: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  title: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  jobRole: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  industry: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  description: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  @IsEnum(WorkSchedule, tsEnumDecorator("validation", "isEnum", WorkSchedule))
  workSchedule: WorkSchedule;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  country: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  city: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsBoolean(tsDefaultDecorator("validation", "isType", { type: "boolean" }))
  isFeatured: boolean;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
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
