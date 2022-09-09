import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { CharacterFactions } from "@rpg-engine/shared";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { CreateCharacterDTO } from "../create/CreateCharacterDTO";

export class UpdateCharacterDTO implements CreateCharacterDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional()
  @IsEnum(CharacterFactions, tsEnumDecorator("validation", "isEnum", CharacterFactions))
  faction: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  race: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  textureKey: string;
}
