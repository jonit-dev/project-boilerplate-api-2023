import { tsDefaultDecorator, tsEnumDecorator } from "@providers/constants/ValidationConstants";
import { CharacterFactions } from "@rpg-engine/shared";
import { ReadCharacterClass } from "@useCases/ModuleCharacter/faction/read/ReadCharacterClass";
import { IsDefined, IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateCharacterDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  name: string;

  // @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  // @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsEnum(CharacterFactions, tsEnumDecorator("validation", "isEnum", CharacterFactions))
  faction: string;

  // @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  // @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  race: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  textureKey: string;

  // @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsIn(ReadCharacterClass.getPlayingCharacterClasses())
  class: string;
}
