import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { CharacterGender } from "tempTypes/CharacterTypes";
import { CreateCharacterDTO } from "../create/CreateCharacterDTO";

export class UpdateCharacterDTO implements CreateCharacterDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsOptional()
  @IsEnum(CharacterGender, tsEnumDecorator("validation", "isEnum", CharacterGender))
  gender: CharacterGender;
}
