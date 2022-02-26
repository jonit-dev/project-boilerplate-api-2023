import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { CharacterGender } from "@rpg-engine/shared";
import { IsDefined, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateCharacterDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsEnum(CharacterGender, tsEnumDecorator("validation", "isEnum", CharacterGender))
  gender: CharacterGender;
}
