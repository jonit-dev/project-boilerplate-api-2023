import { tsDefaultDecorator } from "@providers/constants/ValidationConstants";
import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateABTestDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  slug: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  description: string;

  @IsOptional(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsBoolean(tsDefaultDecorator("validation", "isType", { type: "boolean" }))
  enabled: boolean;
}

export class UpdateABTestDTO {
  @IsOptional(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  slug: string;

  @IsOptional(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  description: string;

  @IsOptional(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsBoolean(tsDefaultDecorator("validation", "isType", { type: "boolean" }))
  enabled: boolean;
}
