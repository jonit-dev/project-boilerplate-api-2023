import { tsDefaultDecorator } from "@providers/constants/ValidationConstants";
import { IsOptional, IsString } from "class-validator";
import { CreateCharacterDTO } from "../create/CreateCharacterDTO";

export class UpdateCharacterDTO implements CreateCharacterDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  textureKey: string;
}
