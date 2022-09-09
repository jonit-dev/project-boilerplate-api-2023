import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { CharacterFactions } from "@rpg-engine/shared";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { CreateCharacterDTO } from "../create/CreateCharacterDTO";

export class UpdateCharacterDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  textureKey: string;
}
