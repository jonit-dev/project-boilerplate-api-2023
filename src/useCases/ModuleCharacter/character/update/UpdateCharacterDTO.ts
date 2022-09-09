import { tsDefaultDecorator } from "@providers/constants/ValidationConstants";
import { IsOptional, IsString } from "class-validator";

export class UpdateCharacterDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  textureKey: string;
}
