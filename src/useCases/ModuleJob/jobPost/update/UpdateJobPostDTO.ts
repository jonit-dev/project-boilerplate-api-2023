import { tsDefaultDecorator } from "@providers/constants/ValidationConstants";
import { IsOptional, IsString } from "class-validator";
import { CreateJobPostDTO } from "../create/CreateJobPostDTO";

export class UpdateJobPostDTO extends CreateJobPostDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  title: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  description: string;
}
