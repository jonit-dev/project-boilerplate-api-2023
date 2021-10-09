import { UserExperience, UserGoal } from "@project-remote-job-board/shared/dist";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { tsDefaultDecorator, tsEnumDecorator } from "../../../providers/constants/ValidationConstants";

class UserPreferencesDTO {
  @IsOptional()
  @IsEnum(UserExperience, tsEnumDecorator("validation", "isEnum", UserExperience))
  experience: UserExperience;

  @IsOptional()
  @IsEnum(UserGoal, tsEnumDecorator("validation", "isEnum", UserGoal))
  goal: UserGoal;
}

export class UserUpdateDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  email: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  address: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  phone: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  pushNotificationToken: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserPreferencesDTO)
  preferences: UserPreferencesDTO;
}
